const express         = require('express');
const router          = express.Router();
const detectionEngine = require('../detection/detectionEngine');

router.get('/status', (req, res) => {
  res.json({ online: detectionEngine.ddosServiceOnline });
});

module.exports = router;