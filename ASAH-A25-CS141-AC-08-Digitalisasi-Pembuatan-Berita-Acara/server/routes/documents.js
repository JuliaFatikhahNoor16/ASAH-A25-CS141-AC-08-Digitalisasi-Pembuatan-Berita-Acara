const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/history', verifyToken, async (req, res) => {
  const { jenis_dokumen, id_dokumen } = req.query;

  try {
    let query = 'SELECT * FROM document_history WHERE 1=1';
    const params = [];

    if (jenis_dokumen) {
      query += ' AND jenis_dokumen = ?';
      params.push(jenis_dokumen);
    }

    if (id_dokumen) {
      query += ' AND id_dokumen = ?';
      params.push(id_dokumen);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const [rows] = await pool.query(query, params);
    res.json({ data: rows });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/stats', verifyToken, async (req, res) => {
  const { role, id } = req.user;

  try {
    let bapbQuery = 'SELECT COUNT(*) as total FROM bapb WHERE 1=1';
    let bappQuery = 'SELECT COUNT(*) as total FROM bapp WHERE 1=1';
    const params = [];

    if (role === 'vendor') {
      bapbQuery += ' AND id_vendor = ?';
      bappQuery += ' AND id_vendor = ?';
      params.push(id);
    }

    const [bapbStats] = await pool.query(bapbQuery, role === 'vendor' ? [id] : []);
    const [bappStats] = await pool.query(bappQuery, role === 'vendor' ? [id] : []);

    const [bapbByStatus] = await pool.query(
      'SELECT status, COUNT(*) as count FROM bapb GROUP BY status'
    );
    const [bappByStatus] = await pool.query(
      'SELECT status, COUNT(*) as count FROM bapp GROUP BY status'
    );

    res.json({
      bapb: {
        total: bapbStats[0]?.total || 0,
        byStatus: bapbByStatus || []
      },
      bapp: {
        total: bappStats[0]?.total || 0,
        byStatus: bappByStatus || []
      }
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
