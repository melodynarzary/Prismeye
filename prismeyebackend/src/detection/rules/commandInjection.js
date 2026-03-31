const commandInjectionRules = [
  {
    id: 'CMD001',
    pattern: /;\s*(ls|dir|cat|type|pwd|whoami|id|uname)/i,
    description: 'Shell command injection using semicolon separator',
    severity: 'high'
  },
  {
    id: 'CMD002',
    pattern: /\|\s*(ls|dir|cat|type|pwd|whoami)/i,
    description: 'Command injection using pipe operator',
    severity: 'high'
  },
  {
    id: 'CMD003',
    pattern: /`[^`]*`/,
    description: 'Command execution using backtick notation',
    severity: 'high'
  },
  {
    id: 'CMD004',
    pattern: /\$\([^)]*\)/,
    description: 'Command substitution attack detected',
    severity: 'high'
  },
  {
    id: 'CMD005',
    pattern: /&&\s*(ls|dir|cat|type|rm|del)/i,
    description: 'Command chaining using AND operator',
    severity: 'high'
  },
  {
    id: 'CMD006',
    pattern: /\|\|\s*(ls|dir|cat|type)/i,
    description: 'Command injection using OR operator',
    severity: 'high'
  },
  {
    id: 'CMD007',
    pattern: /\b(chmod|chown|chgrp)\b/i,
    description: 'Attempt to modify file permissions',
    severity: 'high'
  },
  {
    id: 'CMD008',
    pattern: /\brm\s+-rf|\bdel\s+\/f/i,
    description: 'Destructive file deletion command detected',
    severity: 'high'
  },
  {
    id: 'CMD009',
    pattern: /\b(wget|curl)\b.*http/i,
    description: 'Remote file download attempt detected',
    severity: 'high'
  },
  {
    id: 'CMD010',
    pattern: /\b(nc|netcat)\b.*-e/i,
    description: 'Reverse shell connection attempt',
    severity: 'high'
  },
  {
    id: 'CMD011',
    pattern: /\bsh\b|\bbash\b|\bcmd\.exe\b/i,
    description: 'Direct shell execution attempt',
    severity: 'high'
  },
  {
    id: 'CMD012',
    pattern: />\s*\/dev\/null|>\s*nul/i,
    description: 'Output redirection to hide command results',
    severity: 'low'
  }
];

module.exports = commandInjectionRules;