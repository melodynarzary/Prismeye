const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Request processed', note: 'Any threats were logged but not blocked' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Request processed successfully', received: req.body, note: 'Any threats were logged but not blocked' });
});

module.exports = router;