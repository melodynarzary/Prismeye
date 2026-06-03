const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  type:        { type: String },
  severity:    { type: String, enum: ['high', 'medium', 'low'] },
  source:      { type: String },
  target:      { type: String },
  method:      { type: String },
  server:      { type: String },
  application: { type: String },
  payload:     { type: String },
  matchedRule: { type: String },
  mlDetected:  { type: Boolean, default: false },
  statusCode:  { type: Number },
  timestamp:   { type: Date, default: Date.now },
});

module.exports = mongoose.models.Threat || mongoose.model('Threat', threatSchema);