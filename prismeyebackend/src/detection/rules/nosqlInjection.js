const nosqlInjectionRules = [
  {
    id: 'NOSQL001',
    pattern: /\{\s*\$ne\s*:/i,
    description: 'MongoDB not-equal operator injection',
    severity: 'high'
  },
  {
    id: 'NOSQL002',
    pattern: /\{\s*\$gt\s*:/i,
    description: 'MongoDB greater-than operator detected',
    severity: 'high'
  },
  {
    id: 'NOSQL003',
    pattern: /\{\s*\$lt\s*:/i,
    description: 'MongoDB less-than operator detected',
    severity: 'high'
  },
  {
    id: 'NOSQL004',
    pattern: /\{\s*\$where\s*:/i,
    description: 'MongoDB $where clause injection',
    severity: 'high'
  },
  {
    id: 'NOSQL005',
    pattern: /\{\s*\$regex\s*:/i,
    description: 'MongoDB regex operator manipulation',
    severity: 'medium'
  },
  {
    id: 'NOSQL006',
    pattern: /;\s*return\s+true;/i,
    description: 'JavaScript code injection in NoSQL query',
    severity: 'high'
  },
  {
    id: 'NOSQL007',
    pattern: /\[\$ne\]=|%5B%24ne%5D=/i,
    description: 'URL-encoded NoSQL operator injection',
    severity: 'high'
  },
  {
    id: 'NOSQL008',
    pattern: /this\.(password|username|email)/i,
    description: 'NoSQL query manipulation using this keyword',
    severity: 'high'
  }
];

module.exports = nosqlInjectionRules;
