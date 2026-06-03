const {
  sqlInjectionRules,
  xssRules,
  ssrfRules,
  commandInjectionRules,
  pathTraversalRules,
  localFileInclusionRules,
  xxeRules,
  nosqlInjectionRules,
  crlfRules,
} = require('./rules');

const fs     = require('fs');
const path   = require('path');
const os     = require('os');
const Threat = require('../db/threatLogs');

class DetectionEngine {
  constructor() {
    this.detectedThreats  = [];
    this.logFile          = path.join(__dirname, '../../logs/threats.log');
    this.httpStatusCounts = { '200': 0, '403': 0, '404': 0, '500': 0 };

    this.recentIPs   = new Map();
    this.flowTracker = new Map();
    this.ddosLastLog = new Map();
    this.io          = null;

    this.ddosServiceOnline = false;
    this.checkDdosService();
    setInterval(() => this.checkDdosService(), 10000);

    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    setInterval(() => this.checkCompletedFlows(), 2000);

    setInterval(() => {
      const now = Date.now();
      for (const [key, time] of this.recentIPs.entries()) {
        if (now - time > 60000) this.recentIPs.delete(key);
      }
      for (const [ip, flow] of this.flowTracker.entries()) {
        if (now - flow.lastTime > 120000) this.flowTracker.delete(ip);
      }
      for (const [ip, time] of this.ddosLastLog.entries()) {
        if (now - time > 60000) this.ddosLastLog.delete(ip);
      }
    }, 60000);
  }

  setIO(io) {
    this.io = io;
  }

  async checkDdosService() {
    try {
      const res = await fetch('http://localhost:5001/health');
      if (res.ok) {
        if (!this.ddosServiceOnline) {
          console.log('✅ DDoS ML service online (port 5001)');
          this.ddosServiceOnline = true;
        }
      }
    } catch {
      if (this.ddosServiceOnline) {
        console.warn('⚠️  DDoS ML service went offline');
        this.ddosServiceOnline = false;
      }
    }
  }

  async checkCompletedFlows() {
    if (!this.ddosServiceOnline) return;
    const now = Date.now();
    for (const [ip, flow] of this.flowTracker.entries()) {
      const idleMs = now - flow.lastTime;
      if (idleMs >= 2000 && flow.count >= 20 && !flow.evaluated) {
        flow.evaluated = true;
        await this.evaluateCompletedFlow(ip, flow);
      }
    }
  }

  async evaluateCompletedFlow(ip, flow) {
    try {
      const durationMs    = Math.max(flow.lastTime - flow.startTime, 1);
      const durationSec   = durationMs / 1000;
      const bodyLen       = flow.bytes / flow.count;
      const packetsPerSec = flow.count / durationSec;
      const bytesPerSec   = flow.bytes  / durationSec;

      const iatMean = flow.iatSamples.length
        ? flow.iatSamples.reduce((a, b) => a + b, 0) / flow.iatSamples.length
        : 0;
      const iatVariance = flow.iatSamples.length
        ? flow.iatSamples.reduce((s, v) => s + Math.pow(v - iatMean, 2), 0) / flow.iatSamples.length
        : 0;
      const iatStd = Math.sqrt(iatVariance);
      const iatMax = flow.iatSamples.length ? Math.max(...flow.iatSamples) : 0;
      const iatMin = flow.iatSamples.length ? Math.min(...flow.iatSamples) : 0;
      const avgPktSize = flow.bytes / flow.count;

      const features = {
        'Protocol':                  6,
        'Flow Duration':             durationMs * 1000,
        'Total Fwd Packets':         flow.count,
        'Total Backward Packets':    0,
        'Fwd Packets Length Total':  flow.bytes,
        'Bwd Packets Length Total':  0,
        'Fwd Packet Length Max':     bodyLen,
        'Fwd Packet Length Min':     bodyLen,
        'Fwd Packet Length Mean':    bodyLen,
        'Fwd Packet Length Std':     0,
        'Bwd Packet Length Max':     0,
        'Bwd Packet Length Min':     0,
        'Bwd Packet Length Mean':    0,
        'Bwd Packet Length Std':     0,
        'Flow Bytes/s':              bytesPerSec,
        'Flow Packets/s':            packetsPerSec,
        'Flow IAT Mean':             iatMean,
        'Flow IAT Std':              iatStd,
        'Flow IAT Max':              iatMax,
        'Flow IAT Min':              iatMin,
        'Fwd IAT Total':             durationMs,
        'Fwd IAT Mean':              iatMean,
        'Fwd IAT Std':               iatStd,
        'Fwd IAT Max':               iatMax,
        'Fwd IAT Min':               iatMin,
        'Bwd IAT Total':             0,
        'Bwd IAT Mean':              0,
        'Bwd IAT Std':               0,
        'Bwd IAT Max':               0,
        'Bwd IAT Min':               0,
        'Fwd PSH Flags':             0,
        'Bwd PSH Flags':             0,
        'Fwd URG Flags':             0,
        'Bwd URG Flags':             0,
        'Fwd Header Length':         20,
        'Bwd Header Length':         20,
        'Fwd Packets/s':             packetsPerSec,
        'Bwd Packets/s':             0,
        'Packet Length Min':         bodyLen,
        'Packet Length Max':         bodyLen,
        'Packet Length Mean':        bodyLen,
        'Packet Length Std':         0,
        'Packet Length Variance':    0,
        'FIN Flag Count':            0,
        'SYN Flag Count':            1,
        'RST Flag Count':            0,
        'PSH Flag Count':            0,
        'ACK Flag Count':            1,
        'URG Flag Count':            0,
        'CWE Flag Count':            0,
        'ECE Flag Count':            0,
        'Down/Up Ratio':             0,
        'Avg Packet Size':           avgPktSize,
        'Avg Fwd Segment Size':      bodyLen,
        'Avg Bwd Segment Size':      0,
        'Fwd Avg Bytes/Bulk':        0,
        'Fwd Avg Packets/Bulk':      0,
        'Fwd Avg Bulk Rate':         0,
        'Bwd Avg Bytes/Bulk':        0,
        'Bwd Avg Packets/Bulk':      0,
        'Bwd Avg Bulk Rate':         0,
        'Subflow Fwd Packets':       flow.count,
        'Subflow Fwd Bytes':         flow.bytes,
        'Subflow Bwd Packets':       0,
        'Subflow Bwd Bytes':         0,
        'Init Fwd Win Bytes':        65535,
        'Init Bwd Win Bytes':        65535,
        'Fwd Act Data Packets':      flow.count,
        'Fwd Seg Size Min':          20,
        'Active Mean':               0,
        'Active Std':                0,
        'Active Max':                0,
        'Active Min':                0,
        'Idle Mean':                 0,
        'Idle Std':                  0,
        'Idle Max':                  0,
        'Idle Min':                  0,
      };

      const response = await fetch('http://localhost:5001/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(features),
        signal:  AbortSignal.timeout(3000),
      });

      if (!response.ok) return;
      const result = await response.json();

      if (!result.is_ddos) {
        console.log(`\n✅ Flow from ${ip} evaluated — NOT DDoS (prob: ${(result.probability * 100).toFixed(1)}%)`);
        return;
      }

      const statusCode = (() => {
        if (!flow.statusCodes || flow.statusCodes.length === 0) return 200;
        const counts = {};
        flow.statusCodes.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
        return parseInt(Object.entries(counts).sort(([,a],[,b]) => b - a)[0][0]);
      })();

      const threat = {
        id:           'DDOS-ML-001',
        type:         'DDoS Attack',
        severity:     result.severity,
        description:  `ML model detected DDoS (probability: ${(result.probability * 100).toFixed(1)}%)`,
        detectedIn:   'High volume HTTP flood',
        parameter:    'Flow',
        location:     'Network',
        timestamp:    new Date().toISOString(),
        status:       'detected',
        statusCode:   statusCode,
        mlDetected:   true,
        probability:  result.probability,
        source:       ip,
        target:       flow.target      || 'Unknown',
        method:       flow.method      || 'Unknown',
        application:  flow.application || 'Unknown',
        server:       process.env.SERVER_NAME || os.hostname(),
        flowPackets:  flow.count,
        flowDuration: durationSec.toFixed(1),
      };

      this.detectedThreats.push(threat);
      if (this.detectedThreats.length > 1000) this.detectedThreats = this.detectedThreats.slice(-1000);

      await this.saveThreatsToMongo([threat]);

      if (this.io) {
        this.io.emit('new_threat', threat);
        console.log(`✅ Emitted DDoS: ${result.severity.toUpperCase()} (${(result.probability * 100).toFixed(1)}%)`);
      }

    } catch (e) {
      console.error('evaluateCompletedFlow error:', e.message);
    }
  }

  extractFlowFeatures(request) {
    const { ip, body = {}, url, method, application } = request;
    const now     = Date.now();
    const bodyLen = JSON.stringify(body).length;

    if (!this.flowTracker.has(ip)) {
      this.flowTracker.set(ip, {
        count:       0,
        startTime:   now,
        bytes:       0,
        lastTime:    now,
        iatSamples:  [],
        evaluated:   false,
        target:      url         || 'Unknown',
        method:      method      || 'Unknown',
        application: application || 'Unknown',
        statusCodes: [],
      });
    }

    const flow = this.flowTracker.get(ip);

    if (flow.evaluated) {
      flow.count       = 0;
      flow.startTime   = now;
      flow.bytes       = 0;
      flow.lastTime    = now;
      flow.iatSamples  = [];
      flow.evaluated   = false;
      flow.target      = url         || 'Unknown';
      flow.method      = method      || 'Unknown';
      flow.application = application || 'Unknown';
      flow.statusCodes = [];
    }

    const iat = now - flow.lastTime;
    flow.count++;
    flow.bytes    += bodyLen;
    flow.lastTime  = now;
    flow.iatSamples.push(iat);
    if (flow.iatSamples.length > 200) flow.iatSamples.shift();
  }

  recordFlowStatusCode(ip, statusCode) {
    const flow = this.flowTracker.get(ip);
    if (!flow) return;
    if (!flow.statusCodes) flow.statusCodes = [];
    flow.statusCodes.push(statusCode);
  }

  async detectAsync(request) {
    const ruleThreats = this.detect(request);
    this.extractFlowFeatures(request);
    return ruleThreats;
  }

  detect(request) {
    try {
      const { url, body, headers, method, ip, server, application } = request;

      const now      = Date.now();
      const cacheKey = ip || 'unknown';

      const allThreats = [];

      let urlInput = '';
      try { urlInput = decodeURIComponent(url || ''); } catch { urlInput = url || ''; }

      const bodyObj   = body || {};
      const bodyInput = JSON.stringify(bodyObj);

      const relevantHeaders = {
        'user-agent':      headers['user-agent']      || '',
        'referer':         headers['referer']         || '',
        'cookie':          headers['cookie']          || '',
        'authorization':   headers['authorization']   || '',
        'x-forwarded-for': headers['x-forwarded-for'] || '',
      };

      const parts = [];

      try {
        const urlObj = new URL(urlInput, 'http://localhost');
        urlObj.searchParams.forEach((value, key) => {
          parts.push({ parameter: `${key}=${value}`, value: `${key}=${value}`, location: 'URL' });
        });
        parts.push({ parameter: urlObj.pathname, value: urlInput, location: 'URL' });
      } catch {
        parts.push({ parameter: urlInput, value: urlInput, location: 'URL' });
      }

      if (typeof bodyObj === 'object' && bodyObj !== null && Object.keys(bodyObj).length > 0) {
        Object.entries(bodyObj).forEach(([key, value]) => {
          parts.push({ parameter: `${key}=${value}`, value: String(value), location: 'Body' });
        });
      } else if (bodyInput && bodyInput !== '{}') {
        parts.push({ parameter: bodyInput.substring(0, 60), value: bodyInput, location: 'Body' });
      }

      if (bodyInput && bodyInput !== '{}') {
        parts.push({ parameter: 'body(full)', value: bodyInput, location: 'Body' });
      }

      Object.entries(relevantHeaders).forEach(([key, value]) => {
        if (value) parts.push({ parameter: key, value, location: 'Header' });
      });

      const ruleSets = [
        { rules: nosqlInjectionRules,     type: 'NoSQL Injection'                    },
        { rules: sqlInjectionRules,       type: 'SQL Injection'                      },
        { rules: xssRules,                type: 'Cross-Site Scripting (XSS)'         },
        { rules: ssrfRules,               type: 'Server-Side Request Forgery (SSRF)' },
        { rules: commandInjectionRules,   type: 'Command Injection'                  },
        { rules: pathTraversalRules,      type: 'Path Traversal'                     },
        { rules: localFileInclusionRules, type: 'Local File Inclusion'               },
        { rules: xxeRules,                type: 'XML External Entity (XXE)'          },
        { rules: crlfRules,               type: 'CRLF Injection'                     },
      ];

      for (const { rules, type } of ruleSets) {
        for (const part of parts) {
          const matches = this.checkRules(part.value, rules, type);
          matches.forEach(m => {
            m.parameter  = part.parameter;
            m.location   = part.location;
            m.detectedIn = `[${part.location}] ${part.parameter}`.substring(0, 100);
          });
          allThreats.push(...matches);
        }
      }

      const seenTypes = new Set();
      const deduped   = [];
      for (const threat of allThreats) {
        if (!seenTypes.has(threat.type)) {
          seenTypes.add(threat.type);
          deduped.push(threat);
        }
      }

      deduped.forEach(threat => {
        threat.source      = ip;
        threat.target      = url;
        threat.method      = method;
        threat.server      = server || process.env.SERVER_NAME || os.hostname();
        threat.application = application || 'Unknown';
      });

      if (deduped.length > 0) {
        const newThreats = deduped.filter(threat => {
          const key      = `${cacheKey}:${threat.type}`;
          const lastSeen = this.recentIPs.get(key);
          if (lastSeen && now - lastSeen < 10000) return false;
          this.recentIPs.set(key, now);
          return true;
        });

        if (newThreats.length > 0) {
          this.detectedThreats.push(...newThreats);
          if (this.detectedThreats.length > 1000) this.detectedThreats = this.detectedThreats.slice(-1000);
          return newThreats;
        }

        return [];
      }

      this.httpStatusCounts['200']++;
      return [];

    } catch (e) {
      console.error('detect() crashed:', e.message, e.stack);
      return [];
    }
  }

  checkRules(input, rules, attackType) {
    const matches = [];
    for (let rule of rules) {
      try {
        rule.pattern.lastIndex = 0;
        if (rule.pattern.test(input)) {
          const alreadyAdded = matches.find(m => m.id === rule.id);
          if (!alreadyAdded) {
            matches.push({
              id:             rule.id,
              type:           attackType,
              severity:       rule.severity,
              description:    rule.description,
              matchedPattern: rule.pattern.toString(),
              detectedIn:     input.substring(0, 100),
              timestamp:      new Date().toISOString(),
              status:         'detected',
              statusCode:     null,
            });
          }
        }
        rule.pattern.lastIndex = 0;
      } catch (e) {
        console.error(`Rule ${rule.id} crashed: ${e.message}`);
      }
    }
    matches.sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.severity] - { high: 3, medium: 2, low: 1 }[a.severity]));
    return matches;
  }

  updateThreatStatusCodes(threats, statusCode) {
    threats.forEach(threat => {
      if (threat.mlDetected) return;
      threat.statusCode = statusCode;
      const code = String(statusCode);
      if (Object.prototype.hasOwnProperty.call(this.httpStatusCounts, code)) {
        this.httpStatusCounts[code]++;
      }
    });
    const nonDdos = threats.filter(t => !t.mlDetected);
    if (nonDdos.length > 0) this.logThreats(nonDdos);
  }

  async saveThreatsToMongo(threats) {
    for (const threat of threats) {
      try {
        await Threat.create({
          type:        threat.type,
          severity:    threat.severity,
          source:      threat.source,
          target:      threat.target,
          method:      threat.method,
          server:      threat.server,
          application: threat.application,
          payload:     threat.detectedIn,
          matchedRule: threat.id,
          mlDetected:  threat.mlDetected || false,
          statusCode:  threat.statusCode,
          timestamp:   threat.timestamp,
        });
      } catch (err) {
        console.error(`Failed to save threat to MongoDB: ${err.message}`);
        try { fs.appendFileSync(this.logFile, JSON.stringify(threat) + '\n'); }
        catch (e) { console.error(`Failed to write log: ${e.message}`); }
      }
    }
  }

  logThreats(threats) {
    const grouped = {};
    threats.forEach(t => { if (!grouped[t.type]) grouped[t.type] = []; grouped[t.type].push(t); });

    for (const type in grouped) {
      const primary = grouped[type][0];
      console.log('\nTHREAT DETECTED (MONITORING MODE)');
      console.log('─'.repeat(42));
      console.log(`Type        : ${type}`);
      console.log(`Rule        : ${primary.id} — ${primary.description}`);
      console.log(`Severity    : ${primary.severity.toUpperCase()}`);
      console.log(`Source IP   : ${primary.source || 'Unknown'}`);
      console.log(`Server      : ${primary.server || os.hostname()}`);
      console.log(`Target      : ${primary.target || 'N/A'}`);
      console.log(`Application : ${primary.application || 'N/A'}`);
      console.log(`Parameter   : ${primary.parameter || 'N/A'}`);
      console.log(`Location    : ${primary.location  || 'N/A'}`);
      console.log(`Method      : ${primary.method || 'N/A'}`);
      console.log(`Status Code : ${primary.statusCode}`);
      console.log(`Time        : ${new Date(primary.timestamp).toLocaleString()}`);
      if (primary.mlDetected) {
        console.log(`ML Prob     : ${(primary.probability * 100).toFixed(1)}%`);
        console.log(`Flow Pkts   : ${primary.flowPackets} over ${primary.flowDuration}s`);
        console.log(`Pkts/sec    : ${(primary.flowPackets / primary.flowDuration).toFixed(1)}`);
      }
      console.log('─'.repeat(42));
    }

    // save to MongoDB
    this.saveThreatsToMongo(threats);

    // emit via socket
    if (this.io) {
      threats.forEach(threat => {
        if (!threat.mlDetected) {
          this.io.emit('new_threat', threat);
          console.log('✅ Emitted via logThreats:', threat.type);
        }
      });
    }
  }

  getFlowStats(ip) {
    const flow = this.flowTracker.get(ip);
    if (!flow) return null;
    const durationSec = Math.max((Date.now() - flow.startTime) / 1000, 0.001);
    return {
      ip,
      packets:       flow.count,
      bytes:         flow.bytes,
      duration:      durationSec.toFixed(2),
      packetsPerSec: (flow.count / durationSec).toFixed(1),
      bytesPerSec:   (flow.bytes  / durationSec).toFixed(1),
    };
  }

  getAllFlowStats() {
    return [...this.flowTracker.keys()].map(ip => this.getFlowStats(ip));
  }

  getHttpStatusCodes() {
    return {
      codes: [
        { code: '200', count: this.httpStatusCounts['200'], label: 'OK'           },
        { code: '403', count: this.httpStatusCounts['403'], label: 'Forbidden'    },
        { code: '404', count: this.httpStatusCounts['404'], label: 'Not Found'    },
        { code: '500', count: this.httpStatusCounts['500'], label: 'Server Error' },
      ],
      total: Object.values(this.httpStatusCounts).reduce((a, b) => a + b, 0),
    };
  }

  incrementStatusCode(code) {
    if (Object.prototype.hasOwnProperty.call(this.httpStatusCounts, code)) this.httpStatusCounts[code]++;
  }

  getThreats()                   { return this.detectedThreats; }
  getThreatsBySeverity(severity) { return this.detectedThreats.filter(t => t.severity === severity); }
  getThreatsByType(type)         { return this.detectedThreats.filter(t => t.type === type); }

  getStats() {
    const stats = { total: this.detectedThreats.length, high: 0, medium: 0, low: 0, byType: {} };
    this.detectedThreats.forEach(t => {
      if (t.severity) stats[t.severity] = (stats[t.severity] || 0) + 1;
      stats.byType[t.type] = (stats.byType[t.type] || 0) + 1;
    });
    return stats;
  }
}

module.exports = new DetectionEngine();