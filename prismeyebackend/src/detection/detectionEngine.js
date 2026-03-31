const {
  sqlInjectionRules,
  xssRules,
  ssrfRules,
  commandInjectionRules,
  pathTraversalRules,
  localFileInclusionRules,
  xxeRules,
  nosqlInjectionRules
} = require('./rules');

const fs = require('fs');
const path = require('path');

class DetectionEngine {
  constructor() {
    this.detectedThreats = [];
    this.logFile = path.join(__dirname, '../../logs/threats.log');
    
    // Create logs directory if it doesn't exist
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  // Check input against rules - FIRST MATCH ONLY
  checkRules(input, rules, attackType) {
    // Loop through all rules
    for (let rule of rules) {
      // Test if pattern matches
      if (rule.pattern.test(input)) {
        // FOUND A MATCH - Return immediately (don't check other rules)
        return {
          id: rule.id,
          type: attackType,
          severity: rule.severity,
          description: rule.description,
          matchedPattern: rule.pattern.toString(),
          detectedIn: input.substring(0, 100),
          timestamp: new Date().toISOString(),
          status: 'detected'
        };
      }
    }
    
    // No match found - return null
    return null;
  }

  // Main detection function
  detect(request) {
    const { url, body, headers, method, ip } = request;
    const allThreats = [];

    // Combine all inputs
    const inputs = [
      url || '',
      JSON.stringify(body || {}),
      JSON.stringify(headers || {}),
      method || ''
    ];

    const fullInput = inputs.join(' ');

    // Check for SQL Injection - only first match
    const sqlThreat = this.checkRules(fullInput, sqlInjectionRules, 'SQL Injection');
    if (sqlThreat) allThreats.push(sqlThreat);

    // Check for XSS - only first match
    const xssThreat = this.checkRules(fullInput, xssRules, 'Cross-Site Scripting (XSS)');
    if (xssThreat) allThreats.push(xssThreat);

    // Check for SSRF - only first match
    const ssrfThreat = this.checkRules(fullInput, ssrfRules, 'Server-Side Request Forgery (SSRF)');
    if (ssrfThreat) allThreats.push(ssrfThreat);

    // Check for Command Injection - only first match
    const cmdThreat = this.checkRules(fullInput, commandInjectionRules, 'Command Injection');
    if (cmdThreat) allThreats.push(cmdThreat);

    // Check for Path Traversal - only first match
    const pathThreat = this.checkRules(fullInput, pathTraversalRules, 'Path Traversal');
    if (pathThreat) allThreats.push(pathThreat);

    // Check for Local File Inclusion - only first match
    const lfiThreat = this.checkRules(fullInput, localFileInclusionRules, 'Local File Inclusion');
    if (lfiThreat) allThreats.push(lfiThreat);

    // Check for XXE - only first match
    const xxeThreat = this.checkRules(fullInput, xxeRules, 'XML External Entity (XXE)');
    if (xxeThreat) allThreats.push(xxeThreat);

    // Check for NoSQL Injection - only first match
    const nosqlThreat = this.checkRules(fullInput, nosqlInjectionRules, 'NoSQL Injection');
    if (nosqlThreat) allThreats.push(nosqlThreat);

    // Add request metadata to all detected threats
    allThreats.forEach(threat => {
      threat.source = ip;
      threat.target = url;
      threat.method = method;
    });

    // Log detected threats
    if (allThreats.length > 0) {
      this.logThreats(allThreats);
      this.detectedThreats.push(...allThreats);
    }

    return allThreats;
  }

  // Log threats to console and file
  logThreats(threats) {
    threats.forEach(threat => {
      console.log('\n🔍 THREAT DETECTED (MONITORING MODE)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`ID: ${threat.id}`);
      console.log(`Type: ${threat.type}`);
      console.log(`Severity: ${threat.severity.toUpperCase()}`);
      console.log(`Description: ${threat.description}`);
      console.log(`Source IP: ${threat.source || 'Unknown'}`);
      console.log(`Target: ${threat.target || 'N/A'}`);
      console.log(`Method: ${threat.method || 'N/A'}`);
      console.log(`Status: ${threat.status}`);
      console.log(`Detected In: ${threat.detectedIn}...`);
      console.log(`Time: ${new Date(threat.timestamp).toLocaleString()}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      const logEntry = JSON.stringify(threat) + '\n';
      fs.appendFileSync(this.logFile, logEntry);
    });
  }

  // Get all detected threats
  getThreats() {
    return this.detectedThreats;
  }

  // Get threats by severity level
  getThreatsBySeverity(severity) {
    return this.detectedThreats.filter(t => t.severity === severity);
  }

  // Get threats by attack type
  getThreatsByType(type) {
    return this.detectedThreats.filter(t => t.type === type);
  }

  // Get threat statistics
  getStats() {
    const stats = {
      total: this.detectedThreats.length,
      high: this.getThreatsBySeverity('high').length,
      medium: this.getThreatsBySeverity('medium').length,
      low: this.getThreatsBySeverity('low').length,
      byType: {}
    };

    // Count threats by type
    this.detectedThreats.forEach(threat => {
      stats.byType[threat.type] = (stats.byType[threat.type] || 0) + 1;
    });

    return stats;
  }
}

module.exports = new DetectionEngine();