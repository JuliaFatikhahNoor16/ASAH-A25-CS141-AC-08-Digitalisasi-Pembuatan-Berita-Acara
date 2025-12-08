const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/bapp - List BAPP dengan filter & pagination
router.get('/', verifyToken, async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const { role, id } = req.user;

  try {
    let query = `
      SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan,
             p.nama_lengkap as pic_nama, d.nama_lengkap as direksi_nama
      FROM bapp b
      LEFT JOIN vendor v ON b.id_vendor = v.id_vendor
      LEFT JOIN pic p ON b.id_pic_reviewer = p.id_pic
      LEFT JOIN direksi d ON b.id_direksi_approver = d.id_direksi
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (role === 'vendor') {
      query += ' AND b.id_vendor = ?';
      params.push(id);
    }

    // Filter by status
    if (status && status !== 'all') {
      query += ' AND b.status = ?';
      params.push(status);
    }

    // Search
    if (search) {
      query += ' AND (b.nomor_bapp LIKE ? OR b.no_kontrak LIKE ? OR v.nama_perusahaan LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total untuk pagination
    const countQuery = query.replace('SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan, p.nama_lengkap as pic_nama, d.nama_lengkap as direksi_nama', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await pool.query(query, params);
    
    res.json({
      data: rows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (err) {
    console.error('Get BAPP list error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bapp/:id - Detail BAPP + lampiran + history
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  try {
    // Get BAPP data
    const [bapp] = await pool.query(
      `SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan, 
              p.nama_lengkap as pic_nama, d.nama_lengkap as direksi_nama
       FROM bapp b
       LEFT JOIN vendor v ON b.id_vendor = v.id_vendor
       LEFT JOIN pic p ON b.id_pic_reviewer = p.id_pic
       LEFT JOIN direksi d ON b.id_direksi_approver = d.id_direksi
       WHERE b.id_bapp = ?`,
      [id]
    );

    if (!bapp || bapp.length === 0) {
      return res.status(404).json({ message: 'BAPP tidak ditemukan' });
    }

    // Authorization check
    const document = bapp[0];
    if (role === 'vendor' && document.id_vendor !== userId) {
      return res.status(403).json({ message: 'Akses ditolak. BAPP bukan milik Anda.' });
    }

    // Get lampiran
    const [lampiran] = await pool.query(
      'SELECT * FROM lampiran WHERE jenis_dokumen = ? AND id_dokumen = ? ORDER BY created_at DESC',
      ['bapp', id]
    );

    // Get history
    const [history] = await pool.query(
      `SELECT dh.*, 
        CASE 
          WHEN dh.actor_role = 'vendor' THEN v.nama_lengkap
          WHEN dh.actor_role = 'pic' THEN p.nama_lengkap
          WHEN dh.actor_role = 'direksi' THEN d.nama_lengkap
          ELSE 'System'
        END as actor_name
       FROM document_history dh
       LEFT JOIN vendor v ON dh.actor_id = v.id_vendor AND dh.actor_role = 'vendor'
       LEFT JOIN pic p ON dh.actor_id = p.id_pic AND dh.actor_role = 'pic'
       LEFT JOIN direksi d ON dh.actor_id = d.id_direksi AND dh.actor_role = 'direksi'
       WHERE dh.jenis_dokumen = ? AND dh.id_dokumen = ?
       ORDER BY dh.created_at DESC`,
      ['bapp', id]
    );

    res.json({
      bapp: document,
      lampiran: lampiran || [],
      history: history || []
    });
  } catch (err) {
    console.error('Get BAPP detail error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/bapp - Create new BAPP (draft)
router.post('/', verifyToken, async (req, res) => {
  const { role, id: vendor_id } = req.user;
  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa membuat BAPP' });
  }

  const {
    nomor_bapp,
    no_kontrak,
    tanggal_kontrak,
    nilai_kontrak,
    lokasi_pekerjaan,
    rincian_pekerjaan,
    hasil_pemeriksaan
  } = req.body;

  // Validation
  if (!nomor_bapp || !no_kontrak || !tanggal_kontrak || !nilai_kontrak || !lokasi_pekerjaan) {
    return res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
  }

  try {
    // Check duplicate nomor_bapp
    const [existing] = await pool.query(
      'SELECT id_bapp FROM bapp WHERE nomor_bapp = ?',
      [nomor_bapp]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Nomor BAPP sudah digunakan' });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Insert BAPP (perbaiki typo field nllai_kontrak)
    const [result] = await pool.query(
      `INSERT INTO bapp (
        nomor_bapp, id_vendor, no_kontrak, tanggal_kontrak, nllai_kontrak,
        lokasi_pekerjaan, rincian_pekerjaan, hasil_pemeriksaan, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        nomor_bapp,
        vendor_id,
        no_kontrak,
        tanggal_kontrak,
        nilai_kontrak,
        lokasi_pekerjaan,
        rincian_pekerjaan || '',
        hasil_pemeriksaan || '',
      ]
    );

    const bappId = result.insertId;

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapp',
        bappId,
        'created',
        'vendor',
        vendor_id,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ nomor_bapp, status: 'draft' })
      ]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'BAPP berhasil dibuat sebagai draft',
      id: bappId,
      nomor_bapp: nomor_bapp
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Create BAPP error:', err);
    
    // Handle specific errors
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nomor BAPP sudah digunakan' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      sqlError: err.sqlMessage 
    });
  }
});

// PUT /api/bapp/:id - Update BAPP (draft only)
router.put('/:id', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa update BAPP' });
  }

  const {
    nomor_bapp,
    no_kontrak,
    tanggal_kontrak,
    nilai_kontrak,
    lokasi_pekerjaan,
    rincian_pekerjaan,
    hasil_pemeriksaan
  } = req.body;

  try {
    // Check if document exists and belongs to vendor
    const [bapp] = await pool.query(
      'SELECT * FROM bapp WHERE id_bapp = ? AND id_vendor = ?',
      [id, userId]
    );

    if (!bapp || bapp.length === 0) {
      return res.status(404).json({ 
        message: 'BAPP tidak ditemukan atau bukan milik Anda' 
      });
    }

    const currentBapp = bapp[0];

    // Only draft can be updated
    if (currentBapp.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Hanya BAPP dengan status draft yang bisa diupdate' 
      });
    }

    // Check duplicate nomor_bapp (excluding current)
    if (nomor_bapp && nomor_bapp !== currentBapp.nomor_bapp) {
      const [existing] = await pool.query(
        'SELECT id_bapp FROM bapp WHERE nomor_bapp = ? AND id_bapp != ?',
        [nomor_bapp, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Nomor BAPP sudah digunakan' });
      }
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update BAPP (perbaiki typo field nllai_kontrak)
    await pool.query(
      `UPDATE bapp SET 
        nomor_bapp = ?, no_kontrak = ?, tanggal_kontrak = ?,
        nllai_kontrak = ?, lokasi_pekerjaan = ?, rincian_pekerjaan = ?,
        hasil_pemeriksaan = ?, updated_at = NOW()
      WHERE id_bapp = ?`,
      [
        nomor_bapp || currentBapp.nomor_bapp,
        no_kontrak || currentBapp.no_kontrak,
        tanggal_kontrak || currentBapp.tanggal_kontrak,
        nilai_kontrak || currentBapp.nilai_kontrak,
        lokasi_pekerjaan || currentBapp.lokasi_pekerjaan,
        rincian_pekerjaan || currentBapp.rincian_pekerjaan,
        hasil_pemeriksaan || currentBapp.hasil_pemeriksaan,
        id
      ]
    );

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapp',
        id,
        'updated',
        'vendor',
        userId,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ 
          changes: {
            nomor_bapp: nomor_bapp !== currentBapp.nomor_bapp,
            no_kontrak: no_kontrak !== currentBapp.no_kontrak,
            status: 'draft'
          }
        })
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPP berhasil diupdate',
      id: id
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Update BAPP error:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nomor BAPP sudah digunakan' });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapp/:id/submit - Submit BAPP untuk review
router.put('/:id/submit', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa submit BAPP' });
  }

  try {
    // Check if document exists and belongs to vendor
    const [bapp] = await pool.query(
      'SELECT * FROM bapp WHERE id_bapp = ? AND id_vendor = ? AND status = ?',
      [id, userId, 'draft']
    );

    if (!bapp || bapp.length === 0) {
      return res.status(404).json({ 
        message: 'BAPP tidak ditemukan, bukan milik Anda, atau bukan status draft' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update status to submitted
    await pool.query(
      'UPDATE bapp SET status = ?, updated_at = NOW() WHERE id_bapp = ?',
      ['submitted', id]
    );

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapp',
        id,
        'submitted',
        'vendor',
        userId,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ status: 'submitted' })
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPP berhasil diajukan untuk review',
      id: id,
      status: 'submitted'
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Submit BAPP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/bapp/:id - Delete draft BAPP
router.delete('/:id', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa delete BAPP' });
  }

  try {
    // Check if document exists, belongs to vendor, and is draft
    const [bapp] = await pool.query(
      'SELECT * FROM bapp WHERE id_bapp = ? AND id_vendor = ? AND status = ?',
      [id, userId, 'draft']
    );

    if (!bapp || bapp.length === 0) {
      return res.status(404).json({ 
        message: 'BAPP tidak ditemukan, bukan milik Anda, atau bukan status draft' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Delete lampiran first (if any)
    await pool.query(
      'DELETE FROM lampiran WHERE jenis_dokumen = ? AND id_dokumen = ?',
      ['bapp', id]
    );

    // Delete history
    await pool.query(
      'DELETE FROM document_history WHERE jenis_dokumen = ? AND id_dokumen = ?',
      ['bapp', id]
    );

    // Delete BAPP
    await pool.query('DELETE FROM bapp WHERE id_bapp = ?', [id]);

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPP berhasil dihapus',
      id: id
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Delete BAPP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapp/:id/review - Review BAPP (PIC only) - SUDAH ADA
router.put('/:id/review', verifyToken, async (req, res) => {
  const { role, id: pic_id } = req.user;
  const { id } = req.params;
  const { hasil_pemeriksaan, catatan_review_pic } = req.body;

  if (role !== 'pic') {
    return res.status(403).json({ message: 'Hanya PIC yang bisa review BAPP' });
  }

  try {
    await pool.query(
      `UPDATE bapp SET 
        status = 'reviewed_pic',
        id_pic_reviewer = ?,
        tanggal_review_pic = NOW(),
        hasil_pemeriksaan = ?,
        catatan_review_pic = ?
      WHERE id = ?`,
      [pic_id, hasil_pemeriksaan || null, catatan_review_pic || null, id]
    );

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, aktivitas, actor_role, actor_id, 
        actor_name, keterangan, status_sebelum, status_sesudah, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapp',
        bappId,
        'created',  // aktivitas
        'vendor',
        vendor_id,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ nomor_bapp, status: 'draft' }),  // keterangan
        null,  // status_sebelum
        'draft',  // status_sesudah
      ]
    );

    res.json({ message: 'BAPP berhasil direview' });
  } catch (err) {
    console.error('Review BAPP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapp/:id/approve-direksi - Approve BAPP (Direksi only) - SUDAH ADA
router.put('/:id/approve-direksi', verifyToken, async (req, res) => {
  const { role, id: direksi_id } = req.user;
  const { id } = req.params;
  const { catatan_approval_direksi } = req.body;

  if (role !== 'direksi') {
    return res.status(403).json({ message: 'Hanya direksi yang bisa approve BAPP' });
  }

  try {
    await pool.query(
      `UPDATE bapp SET 
        status = 'approved_direksi',
        id_direksi_approver = ?,
        tanggal_approval_direksi = NOW(),
        catatan_approval_direksi = ?
      WHERE id = ? AND status = 'reviewed_pic'`,
      [direksi_id, catatan_approval_direksi || null, id]
    );

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapp',
        id,
        'approved',
        'direksi',
        direksi_id,
        req.user.nama_lengkap || 'Direksi',
        JSON.stringify({ 
          status: 'approved_direksi',
          catatan: catatan_approval_direksi 
        })
      ]
    );

    res.json({ message: 'BAPP berhasil disetujui direksi' });
  } catch (err) {
    console.error('Approve BAPP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;