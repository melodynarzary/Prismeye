const pathTraversalRules = [
  {
    id: 'PATH001',
    pattern: /\.\.\//,
    description: 'Directory traversal using ../ sequence',
    severity: 'high'
  },
  {
    id: 'PATH002',
    pattern: /\.\.%2F|\.\.%5C/i,
    description: 'URL-encoded directory traversal attempt',
    severity: 'high'
  },
  {
    id: 'PATH003',
    pattern: /%2e%2e%2f|%2e%2e%5c/i,
    description: 'Double URL-encoded path traversal',
    severity: 'high'
  },
  {
    id: 'PATH004',
    pattern: /\.\.\\/,
    description: 'Windows-style directory traversal detected',
    severity: 'high'
  },
  {
    id: 'PATH005',
    pattern: /\/etc\/passwd|\/etc\/shadow/i,
    description: 'Attempt to access Unix password files',
    severity: 'high'
  },
  {
    id: 'PATH006',
    pattern: /C:\\Windows\\System32|C:\\boot\.ini/i,
    description: 'Attempt to access Windows system files',
    severity: 'high'
  },
  {
    id: 'PATH007',
    pattern: /\.\.;|\.\.%3B/i,
    description: 'Path traversal using semicolon bypass',
    severity: 'medium'
  },
  {
    id: 'PATH008',
    pattern: /\.\/%2e\./,
    description: 'Mixed encoding path traversal technique',
    severity: 'medium'
  },
  {
    id: 'PATH009',
    pattern: /\.\.\/\.\.\/\.\.\//,
    description: 'Deep directory traversal attempt',
    severity: 'high'
  },
  {
    id: 'PATH010',
    pattern: /\0|%00/,
    description: 'Null byte injection in file path',
    severity: 'high'
  }
];

module.exports = pathTraversalRules;