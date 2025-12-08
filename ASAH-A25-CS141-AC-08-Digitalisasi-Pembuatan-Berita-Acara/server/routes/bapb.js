const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/bapb - List BAPB dengan filter & pagination
router.get('/', verifyToken, async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const { role, id } = req.user;

  try {
    let query = `
      SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan
      FROM bapb b
      LEFT JOIN vendor v ON b.id_vendor = v.id_vendor
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
      query += ' AND (b.nomor_bapb LIKE ? OR b.no_kontrak LIKE ? OR v.nama_perusahaan LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total untuk pagination
    const countQuery = query.replace('SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan', 'SELECT COUNT(*) as total');
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
    console.error('Get BAPB list error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bapb/:id - Detail BAPB + lampiran + history
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  try {
    // Get BAPB data
    const [bapb] = await pool.query(
      `SELECT b.*, v.nama_lengkap as vendor_nama, v.nama_perusahaan, 
              p.nama_lengkap as pic_nama
       FROM bapb b
       LEFT JOIN vendor v ON b.id_vendor = v.id_vendor
       LEFT JOIN pic p ON b.id_pic_reviewer = p.id_pic
       WHERE b.id_bapb = ?`,
      [id]
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ message: 'BAPB tidak ditemukan' });
    }

    // Authorization check
    const document = bapb[0];
    if (role === 'vendor' && document.id_vendor !== userId) {
      return res.status(403).json({ message: 'Akses ditolak. BAPB bukan milik Anda.' });
    }

    // Get lampiran
    const [lampiran] = await pool.query(
      'SELECT * FROM lampiran WHERE jenis_dokumen = ? AND id_dokumen = ? ORDER BY created_at DESC',
      ['bapb', id]
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
      ['bapb', id]
    );

    res.json({
      bapb: document,
      lampiran: lampiran || [],
      history: history || []
    });
  } catch (err) {
    console.error('Get BAPB detail error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/bapb - Create new BAPB (draft)
router.post('/', verifyToken, async (req, res) => {
  const { role, id: vendor_id } = req.user;
  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa membuat BAPB' });
  }

  const {
    nomor_bapb,
    no_kontrak,
    tanggal_kontrak,
    nilai_kontrak,
    tanggal_pengiriman,
    lokasi_pengiriman,
    rincian_barang,
    keterangan
  } = req.body;

  // Validation
  if (!nomor_bapb || !no_kontrak || !tanggal_kontrak || !nilai_kontrak || !tanggal_pengiriman) {
    return res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
  }

  try {
    // Check duplicate nomor_bapb
    const [existing] = await pool.query(
      'SELECT id_bapb FROM bapb WHERE nomor_bapb = ?',
      [nomor_bapb]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Nomor BAPB sudah digunakan' });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Insert BAPB
    const [result] = await pool.query(
      `INSERT INTO bapb (
        nomor_bapb, id_vendor, no_kontrak, tanggal_kontrak, nilai_kontrak,
        tanggal_pengiriman, lokasi_pengiriman, rincian_barang, keterangan, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        nomor_bapb,
        vendor_id,
        no_kontrak,
        tanggal_kontrak,
        nilai_kontrak,
        tanggal_pengiriman,
        lokasi_pengiriman || '',
        rincian_barang || '',
        keterangan || ''
      ]
    );

    const bapbId = result.insertId;

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapb',
        bapbId,
        'created',
        'vendor',
        vendor_id,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ nomor_bapb, status: 'draft' })
      ]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'BAPB berhasil dibuat sebagai draft',
      id: bapbId,
      nomor_bapb: nomor_bapb
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Create BAPB error:', err);
    
    // Handle specific errors
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nomor BAPB sudah digunakan' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      sqlError: err.sqlMessage 
    });
  }
});

// PUT /api/bapb/:id - Update BAPB (draft only)
router.put('/:id', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa update BAPB' });
  }

  const {
    nomor_bapb,
    no_kontrak,
    tanggal_kontrak,
    nilai_kontrak,
    tanggal_pengiriman,
    lokasi_pengiriman,
    rincian_barang,
    keterangan
  } = req.body;

  try {
    // Check if document exists and belongs to vendor
    const [bapb] = await pool.query(
      'SELECT * FROM bapb WHERE id_bapb = ? AND id_vendor = ?',
      [id, userId]
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ 
        message: 'BAPB tidak ditemukan atau bukan milik Anda' 
      });
    }

    const currentBapb = bapb[0];

    // Only draft can be updated
    if (currentBapb.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Hanya BAPB dengan status draft yang bisa diupdate' 
      });
    }

    // Check duplicate nomor_bapb (excluding current)
    if (nomor_bapb && nomor_bapb !== currentBapb.nomor_bapb) {
      const [existing] = await pool.query(
        'SELECT id_bapb FROM bapb WHERE nomor_bapb = ? AND id_bapb != ?',
        [nomor_bapb, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Nomor BAPB sudah digunakan' });
      }
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update BAPB
    await pool.query(
      `UPDATE bapb SET 
        nomor_bapb = ?, no_kontrak = ?, tanggal_kontrak = ?,
        nilai_kontrak = ?, tanggal_pengiriman = ?, lokasi_pengiriman = ?,
        rincian_barang = ?, keterangan = ?, updated_at = NOW()
      WHERE id_bapb = ?`,
      [
        nomor_bapb || currentBapb.nomor_bapb,
        no_kontrak || currentBapb.no_kontrak,
        tanggal_kontrak || currentBapb.tanggal_kontrak,
        nilai_kontrak || currentBapb.nilai_kontrak,
        tanggal_pengiriman || currentBapb.tanggal_pengiriman,
        lokasi_pengiriman || currentBapb.lokasi_pengiriman,
        rincian_barang || currentBapb.rincian_barang,
        keterangan || currentBapb.keterangan,
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
        'bapb',
        id,
        'updated',
        'vendor',
        userId,
        req.user.nama_lengkap || 'Vendor',
        JSON.stringify({ 
          changes: {
            nomor_bapb: nomor_bapb !== currentBapb.nomor_bapb,
            no_kontrak: no_kontrak !== currentBapb.no_kontrak,
            status: 'draft'
          }
        })
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPB berhasil diupdate',
      id: id
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Update BAPB error:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Nomor BAPB sudah digunakan' });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapb/:id/submit - Submit BAPB untuk review
router.put('/:id/submit', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa submit BAPB' });
  }

  try {
    // Check if document exists and belongs to vendor
    const [bapb] = await pool.query(
      'SELECT * FROM bapb WHERE id_bapb = ? AND id_vendor = ? AND status = ?',
      [id, userId, 'draft']
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ 
        message: 'BAPB tidak ditemukan, bukan milik Anda, atau bukan status draft' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update status to submitted
    await pool.query(
      'UPDATE bapb SET status = ?, updated_at = NOW() WHERE id_bapb = ?',
      ['submitted', id]
    );

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, action, actor_role, actor_id, 
        actor_name, details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapb',
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
      message: 'BAPB berhasil diajukan untuk review',
      id: id,
      status: 'submitted'
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Submit BAPB error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/bapb/:id - Delete draft BAPB
router.delete('/:id', verifyToken, async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  if (role !== 'vendor') {
    return res.status(403).json({ message: 'Hanya vendor yang bisa delete BAPB' });
  }

  try {
    // Check if document exists, belongs to vendor, and is draft
    const [bapb] = await pool.query(
      'SELECT * FROM bapb WHERE id_bapb = ? AND id_vendor = ? AND status = ?',
      [id, userId, 'draft']
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ 
        message: 'BAPB tidak ditemukan, bukan milik Anda, atau bukan status draft' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Delete lampiran first (if any)
    await pool.query(
      'DELETE FROM lampiran WHERE jenis_dokumen = ? AND id_dokumen = ?',
      ['bapb', id]
    );

    // Delete history
    await pool.query(
      'DELETE FROM document_history WHERE jenis_dokumen = ? AND id_dokumen = ?',
      ['bapb', id]
    );

    // Delete BAPB
    await pool.query('DELETE FROM bapb WHERE id_bapb = ?', [id]);

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPB berhasil dihapus',
      id: id
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Delete BAPB error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapb/:id/review - Review BAPB (PIC only)
router.put('/:id/review', verifyToken, async (req, res) => {
  const { role, id: pic_id } = req.user;
  const { id } = req.params;
  const { catatan_review } = req.body;

  if (role !== 'pic') {
    return res.status(403).json({ message: 'Hanya PIC yang bisa review BAPB' });
  }

  try {
    // Check if BAPB exists and is in submitted status
    const [bapb] = await pool.query(
      'SELECT * FROM bapb WHERE id_bapb = ? AND status = ?',
      [id, 'submitted']
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ 
        message: 'BAPB tidak ditemukan atau belum diajukan untuk review' 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update BAPB status
    await pool.query(
      `UPDATE bapb SET 
        status = 'reviewed',
        id_pic_reviewer = ?,
        tanggal_review = NOW(),
        catatan_review = ?,
        updated_at = NOW()
      WHERE id_bapb = ?`,
      [pic_id, catatan_review || null, id]
    );

    // Add to history (PERBAIKI: sesuaikan dengan database schema)
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, aktivitas, actor_role, actor_id, 
        actor_name, keterangan, status_sebelum, status_sesudah, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapb',
        id,
        'reviewed',
        'pic',
        pic_id,
        req.user.nama_lengkap || 'PIC',
        catatan_review || 'Dokumen direview oleh PIC',
        'submitted',
        'reviewed'
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPB berhasil direview',
      id: id,
      status: 'reviewed'
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Review BAPB error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/bapb/:id/approve - Approve BAPB (PIC/Direksi based on workflow)
router.put('/:id/approve', verifyToken, async (req, res) => {
  const { role, id: approver_id } = req.user;
  const { id } = req.params;
  const { catatan_approval } = req.body;

  // Authorization: PIC bisa approve setelah review, Direksi bisa approve langsung
  if (!['pic', 'direksi'].includes(role)) {
    return res.status(403).json({ message: 'Hanya PIC atau Direksi yang bisa approve BAPB' });
  }

  try {
    // Check current status
    const [bapb] = await pool.query(
      'SELECT * FROM bapb WHERE id_bapb = ?',
      [id]
    );

    if (!bapb || bapb.length === 0) {
      return res.status(404).json({ message: 'BAPB tidak ditemukan' });
    }

    const currentBapb = bapb[0];
    let newStatus = '';
    let actorRole = role;

    // Determine next status based on current status and role
    if (role === 'pic' && currentBapb.status === 'reviewed') {
      newStatus = 'approved_pic';
    } else if (role === 'direksi' && currentBapb.status === 'approved_pic') {
      newStatus = 'approved_direksi';
    } else {
      return res.status(400).json({ 
        message: `Status saat ini (${currentBapb.status}) tidak bisa diapprove oleh ${role}` 
      });
    }

    // Start transaction
    await pool.query('START TRANSACTION');

    // Update BAPB
    const updateQuery = role === 'pic' 
      ? `UPDATE bapb SET 
          status = ?,
          id_pic_reviewer = ?,
          tanggal_review = NOW(),
          catatan_review = ?,
          updated_at = NOW()
        WHERE id_bapb = ?`
      : `UPDATE bapb SET 
          status = ?,
          updated_at = NOW()
        WHERE id_bapb = ?`;

    const updateParams = role === 'pic' 
      ? [newStatus, approver_id, catatan_approval || null, id]
      : [newStatus, id];

    await pool.query(updateQuery, updateParams);

    // Add to history
    await pool.query(
      `INSERT INTO document_history (
        jenis_dokumen, id_dokumen, aktivitas, actor_role, actor_id, 
        actor_name, keterangan, status_sebelum, status_sesudah, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'bapb',
        id,
        'approved',
        actorRole,
        approver_id,
        req.user.nama_lengkap || actorRole,
        catatan_approval || `Dokumen disetujui oleh ${actorRole}`,
        currentBapb.status,
        newStatus
      ]
    );

    await pool.query('COMMIT');

    res.json({ 
      message: 'BAPB berhasil disetujui',
      id: id,
      status: newStatus
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Approve BAPB error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;