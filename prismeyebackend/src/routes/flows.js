const express         = require('express');
const router          = express.Router();
const detectionEngine = require('../detection/detectionEngine');

router.get('/', (req, res) => {
  res.json({ success: true, flows: detectionEngine.getAllFlowStats() });
});

router.get('/:ip', (req, res) => {
  const stats = detectionEngine.getFlowStats(req.params.ip);
  if (!stats) return res.json({ success: false, message: 'No flow found for this IP' });
  res.json({ success: true, flow: stats });
});

module.exports = router;