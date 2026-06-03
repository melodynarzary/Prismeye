const express   = require('express');
const router    = express.Router();
const NormalLog = require('../db/normalLog');

router.get('/count', async (req, res) => {
  try {
    const count = await NormalLog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;