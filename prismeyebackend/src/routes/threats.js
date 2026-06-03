const express = require('express');
const router  = express.Router();
const Threat  = require('../db/threatLogs');

router.get('/', async (req, res) => {
  try {
    const threats = await Threat.find().sort({ timestamp: -1 });
    res.json({ success: true, threats, count: threats.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const threats = await Threat.find();
    const stats   = { total: threats.length, high: 0, medium: 0, low: 0, byType: {} };
    threats.forEach(t => {
      if (t.severity) stats[t.severity] = (stats[t.severity] || 0) + 1;
      stats.byType[t.type] = (stats.byType[t.type] || 0) + 1;
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/severity/:level', async (req, res) => {
  try {
    const threats = await Threat.find({ severity: req.params.level }).sort({ timestamp: -1 });
    res.json({ success: true, severity: req.params.level, threats, count: threats.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const threats = await Threat.find({ type: req.params.type }).sort({ timestamp: -1 });
    res.json({ success: true, type: req.params.type, threats, count: threats.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;