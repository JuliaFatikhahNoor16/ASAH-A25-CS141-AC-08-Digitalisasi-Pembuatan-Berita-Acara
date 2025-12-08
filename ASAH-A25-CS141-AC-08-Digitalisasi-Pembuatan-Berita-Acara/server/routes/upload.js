const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan di folder 'uploads' di root project
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Format: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar, PDF, dan Word yang diizinkan'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: fileFilter
});

// POST /api/upload/:jenis/:id - Upload lampiran untuk dokumen
router.post('/:jenis/:id', verifyToken, upload.array('files', 5), async (req, res) => {
  const { jenis, id } = req.params;
  const { role, id: userId } = req.user;
  const { keterangan } = req.body;

  // Validasi jenis dokumen
  if (!['bapb', 'bapp'].includes(jenis)) {
    return res.status(400).json({ message: 'Jenis dokumen tidak valid' });
  }

  try {
    // Validasi dokumen exists dan milik vendor (jika vendor)
    let tableName = jenis === 'bapb' ? 'bapb' : 'bapp';
    let idColumn = jenis === 'bapb' ? 'id_bapb' : 'id_bapp';
    
    const [doc] = await pool.query(
      `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`,
      [id]
    );

    if (!doc || doc.length === 0) {
      return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
    }

    const document = doc[0];

    // Authorization: vendor hanya bisa upload ke dokumen miliknya
    if (role === 'vendor' && document.id_vendor !== userId) {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses ke dokumen ini' 
      });
    }

    // Authorization: hanya draft yang bisa ditambah lampiran oleh vendor
    if (role === 'vendor' && document.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Hanya dokumen dengan status draft yang bisa ditambah lampiran' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    const uploadedFiles = [];

    // Simpan setiap file ke database
    for (const file of req.files) {
      const [result] = await pool.query(
        `INSERT INTO lampiran (
          jenis_dokumen, id_dokumen, nama_file, nama_asli, 
          tipe_file, ukuran, path, keterangan, uploaded_by, uploaded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          jenis,
          id,
          file.filename,
          file.originalname,
          file.mimetype,
          file.size,
          file.path,
          keterangan || '',
          req.user.nama_lengkap || 'User'
        ]
      );

      uploadedFiles.push({
        id: result.insertId,
        nama_file: file.filename,
        nama_asli: file.originalname,
        tipe_file: file.mimetype,
        ukuran: file.size,
        path: file.path
      });
    }

    // Add to history jika ada file yang diupload
    if (uploadedFiles.length > 0) {
      await pool.query(
        `INSERT INTO document_history (
          jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
          actor_name, details, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          jenis,
          id,
          'upload_lampiran',
          role,
          userId,
          req.user.nama_lengkap || 'User',
          JSON.stringify({ 
            jumlah_file: uploadedFiles.length,
            files: uploadedFiles.map(f => f.nama_asli)
          })
        ]
      );
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: `${uploadedFiles.length} file berhasil diupload`,
      files: uploadedFiles
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Upload error:', err);
    
    // Hapus file yang sudah diupload jika error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fs = require('fs');
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      message: 'Upload gagal', 
      error: err.message 
    });
  }
});

// DELETE /api/upload/:id - Hapus lampiran
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  try {
    // Get lampiran info
    const [lampiran] = await pool.query(
      `SELECT l.*, b.id_vendor, b.status 
       FROM lampiran l
       LEFT JOIN bapb b ON l.jenis_dokumen = 'bapb' AND l.id_dokumen = b.id_bapb
       LEFT JOIN bapp p ON l.jenis_dokumen = 'bapp' AND l.id_dokumen = p.id_bapp
       WHERE l.id_lampiran = ?`,
      [id]
    );

    if (!lampiran || lampiran.length === 0) {
      return res.status(404).json({ message: 'Lampiran tidak ditemukan' });
    }

    const file = lampiran[0];

    // Authorization: vendor hanya bisa hapus lampiran di dokumen miliknya yang masih draft
    if (role === 'vendor') {
      if (file.id_vendor !== userId) {
        return res.status(403).json({ 
          message: 'Anda tidak memiliki akses ke lampiran ini' 
        });
      }
      if (file.status !== 'draft') {
        return res.status(400).json({ 
          message: 'Hanya bisa hapus lampiran pada dokumen dengan status draft' 
        });
      }
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Hapus dari database
    await pool.query('DELETE FROM lampiran WHERE id_lampiran = ?', [id]);

    // Hapus file fisik
    const fs = require('fs');
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        file.jenis_dokumen,
        file.id_dokumen,
        'delete_lampiran',
        role,
        userId,
        req.user.nama_lengkap || 'User',
        JSON.stringify({ 
          nama_file: file.nama_asli
        })
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'Lampiran berhasil dihapus',
      id: id
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Delete lampiran error:', err);
    res.status(500).json({ 
      message: 'Gagal menghapus lampiran', 
      error: err.message 
    });
  }
});

// GET /api/upload/download/:id - Download lampiran
router.get('/download/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [lampiran] = await pool.query(
      'SELECT * FROM lampiran WHERE id_lampiran = ?',
      [id]
    );

    if (!lampiran || lampiran.length === 0) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }

    const file = lampiran[0];
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File tidak ditemukan di server' });
    }

    res.download(file.path, file.nama_asli);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Download gagal', error: err.message });
  }
});

module.exports = router;