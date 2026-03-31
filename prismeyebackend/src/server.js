const express = require('express');
const cors = require('cors');
require('dotenv').config();

const detectionEngine = require('./detection/detectionEngine');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Detection Middleware (MONITORING MODE - NO BLOCKING)
app.use((req, res, next) => {
  const request = {
    ip: req.ip,
    url: req.url,
    body: req.body,
    headers: req.headers,
    method: req.method
  };

  // Run detection on every request
  detectionEngine.detect(request);
  
  // Always continue - never block
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'PROXIID Detection Engine Running',
    status: 'active',
    mode: 'monitoring-only',
    attackTypes: 8,
    totalRules: 90,
    version: '1.0.0'
  });
});

// Get threat statistics
app.get('/api/threats/stats', (req, res) => {
  const stats = detectionEngine.getStats();
  res.json(stats);
});

// Get all threats
app.get('/api/threats', (req, res) => {
  const threats = detectionEngine.getThreats();
  res.json({ 
    success: true,
    threats, 
    count: threats.length 
  });
});

// Get threats by severity level
app.get('/api/threats/severity/:level', (req, res) => {
  const { level } = req.params;
  const threats = detectionEngine.getThreatsBySeverity(level);
  res.json({ 
    success: true,
    severity: level,
    threats, 
    count: threats.length 
  });
});

// Get threats by type
app.get('/api/threats/type/:type', (req, res) => {
  const { type } = req.params;
  const threats = detectionEngine.getThreatsByType(type);
  res.json({ 
    success: true,
    type: type,
    threats, 
    count: threats.length 
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Request processed successfully',
    received: req.body,
    note: 'Any threats were logged but not blocked'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 PROXIID DETECTION ENGINE v1.0.0`);
  console.log(`${'='.repeat(50)}\n`);
  
  console.log(`📡 Server Information:`);
  console.log(`   ├─ Port: ${PORT}`);
  console.log(`   ├─ Mode: MONITORING ONLY (No Blocking)`);
  console.log(`   ├─ Status: Active`);
  console.log(`   └─ Logs: logs/threats.log\n`);
  
  console.log(`🛡️  Detection Coverage:`);
  console.log(`   ├─ Attack Types: 8`);
  console.log(`   ├─ Total Rules: 90`);
  console.log(`   └─ Severity Levels: High, Medium, Low\n`);
  
  console.log(`📊 Attack Types Monitored:`);
  console.log(`   ├─ SQL Injection (15 rules)`);
  console.log(`   ├─ Cross-Site Scripting (15 rules)`);
  console.log(`   ├─ SSRF (12 rules)`);
  console.log(`   ├─ Command Injection (12 rules)`);
  console.log(`   ├─ Path Traversal (10 rules)`);
  console.log(`   ├─ Local File Inclusion (10 rules)`);
  console.log(`   ├─ XXE (8 rules)`);
  console.log(`   └─ NoSQL Injection (8 rules)\n`);
  
  console.log(`🔗 API Endpoints:`);
  console.log(`   ├─ GET  /`);
  console.log(`   ├─ GET  /api/threats/stats`);
  console.log(`   ├─ GET  /api/threats`);
  console.log(`   ├─ GET  /api/threats/severity/:level`);
  console.log(`   ├─ GET  /api/threats/type/:type`);
  console.log(`   └─ POST /api/test\n`);
  
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Server ready! Monitoring all incoming requests...`);
  console.log(`${'='.repeat(50)}\n`);
});