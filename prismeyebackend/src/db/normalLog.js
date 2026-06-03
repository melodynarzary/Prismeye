const mongoose = require('mongoose');

const normalSchema = new mongoose.Schema({
  source:     { type: String },
  target:     { type: String },
  method:     { type: String },
  server:     { type: String },
  statusCode: { type: Number },
  timestamp:  { type: Date, default: Date.now },
});

module.exports = mongoose.models.NormalLog || mongoose.model('NormalLog', normalSchema);