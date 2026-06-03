const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
const fs         = require('fs');
const path       = require('path');
const os         = require('os');
const { spawn }  = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const connectDB       = require('./db/connection');
const detectionEngine = require('./detection/detectionEngine');
const NormalLog       = require('./db/normalLog');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

connectDB();
detectionEngine.setIO(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SERVER_NAME = process.env.SERVER_NAME || os.hostname();
const TARGET_URL  = process.env.TARGET_URL  || null;

// ── Auto-start Python ML service ──────────────────────────
function startPythonService() {
  const pythonScript = path.join(__dirname, '../ml/ddos_service.py');

  if (!fs.existsSync(pythonScript)) {
    console.warn('⚠️  ML script not found at:', pythonScript);
    return;
  }


  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

  const pyProcess = spawn(pythonCmd, [pythonScript], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  pyProcess.stdout.on('data', (data) => {
    console.log(`[ML] ${data.toString().trim()}`);
  });

  pyProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.warn(`[ML] ${msg}`);
  });

  pyProcess.on('close', (code) => {
    console.warn(`⚠️  ML service exited with code ${code}. Restarting in 5s...`);
    setTimeout(startPythonService, 5000);
  });

  pyProcess.on('error', (err) => {
    console.error('❌ Failed to start ML service:', err.message);
    console.warn('Make sure Python is installed and accessible.');
  });

  console.log('🐍 ML service starting...');
  return pyProcess;
}

startPythonService();
// ──────────────────────────────────────────────────────────

const SKIP_ROUTES = [
  '/api/threats',
  '/api/normal',
  '/api/ddos',
  '/api/flows',
  '/api/server',
  '/api/auth',
];

// detection middleware
app.use(async (req, res, next) => {
  if (req.originalUrl.startsWith('/socket.io') || req.originalUrl === '/') return next();
  if (SKIP_ROUTES.some(r => req.originalUrl.startsWith(r))) return next();

  const request = {
    ip:          req.ip,
    url:         req.originalUrl,
    query:       req.query,
    body:        req.body,
    headers:     req.headers,
    method:      req.method,
    server:      SERVER_NAME,
    application: req.headers['x-app-name'] || 'Unknown',
  };

  const threats = await detectionEngine.detectAsync(request);

  if (threats.length === 0) {
    try {
      await NormalLog.create({
        source:     req.ip,
        target:     req.originalUrl,
        method:     req.method,
        server:     SERVER_NAME,
        statusCode: 200,
        timestamp:  new Date(),
      });
      const count = await NormalLog.countDocuments();
      io.emit('normal_count', count);
    } catch (err) {
      console.error('NormalLog save error:', err.message);
    }
  } else {
    res.on('finish', () => {
      detectionEngine.updateThreatStatusCodes(threats, res.statusCode);
    });
  }

  next();
});

// root route
app.get('/', (req, res) => {
  if (TARGET_URL) return res.redirect(TARGET_URL);
  res.json({
    message:     'PROXIID Detection Engine Running',
    status:      'active',
    mode:        TARGET_URL ? 'proxy' : 'monitoring-only',
    attackTypes: 9,
    totalRules:  90,
    mlDdos:      detectionEngine.ddosServiceOnline ? 'online' : 'offline',
    version:     '2.0.0',
    server:      SERVER_NAME,
  });
});

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/threats', require('./routes/threats'));
app.use('/api/normal',  require('./routes/normal'));
app.use('/api/ddos',    require('./routes/ddos'));
app.use('/api/flows',   require('./routes/flows'));
app.use('/api/server',  require('./routes/serverMetrics'));
app.use('/api/test',    require('./routes/test'));

// proxy to developer's app
if (TARGET_URL) {
  app.use('/', createProxyMiddleware({
    target:       TARGET_URL,
    changeOrigin: true,
    ws:           true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ message: 'Target app unreachable', error: err.message });
      },
    },
  }));
  console.log(`Proxying → ${TARGET_URL}`);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`PROXIID DETECTION ENGINE v2.0.0`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`Port        : ${PORT}`);
  console.log(`Server Name : ${SERVER_NAME}`);
  console.log(`Target App  : ${TARGET_URL || 'Not set'}`);
  console.log(`WebSocket   : Socket.io active`);
  console.log(`Mode        : ${TARGET_URL ? 'PROXY + DETECTION' : 'MONITORING ONLY'}`);
  console.log(`ML DDoS     : starting on port 5001...`);
  console.log(`${'='.repeat(50)}\n`);
});