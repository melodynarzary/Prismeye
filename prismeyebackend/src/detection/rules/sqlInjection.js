const sqlInjectionRules = [
  {
    id: 'SQL001',
    pattern: /(\bSELECT\b.*\bFROM\b)/i,
    description: 'SQL SELECT query detected in user input',
    severity: 'high'
  },
  {
    id: 'SQL002',
    pattern: /(\bUNION\b.*\bSELECT\b)/i,
    description: 'SQL UNION-based injection attack attempt',
    severity: 'high'
  },
  {
    id: 'SQL003',
    pattern: /(\bDROP\b.*\bTABLE\b)/i,
    description: 'Attempt to delete database table detected',
    severity: 'high'
  },
  {
    id: 'SQL004',
    pattern: /(\bINSERT\b.*\bINTO\b)/i,
    description: 'Unauthorized data insertion attempt',
    severity: 'high'
  },
  {
    id: 'SQL005',
    pattern: /(\bDELETE\b.*\bFROM\b)/i,
    description: 'Attempt to delete database records',
    severity: 'high'
  },
  {
    id: 'SQL006',
    pattern: /('|"\s*)(OR|AND)\s*('|")?\s*=\s*('|")?/i,
    description: 'SQL authentication bypass attempt using OR/AND',
    severity: 'high'
  },
  {
    id: 'SQL007',
    pattern: /(\s--\s|\s#\s|\/\*.*\*\/)/,
    description: 'SQL comment-based injection detected',
    severity: 'medium'
  },
  {
    id: 'SQL008',
    pattern: /(\bEXEC\b|\bEXECUTE\b)/i,
    description: 'SQL command execution attempt',
    severity: 'high'
  },
  {
    id: 'SQL009',
    pattern: /'.*OR.*1\s*=\s*1/i,
    description: 'Classic SQL injection pattern (1=1) detected',
    severity: 'high'
  },
  {
    id: 'SQL010',
    pattern: /\b(SLEEP|BENCHMARK|WAITFOR)\b/i,
    description: 'Time-based blind SQL injection attempt',
    severity: 'high'
  },
  {
    id: 'SQL011',
    pattern: /\bAND\b.*\d+\s*=\s*\d+/i,
    description: 'Boolean-based blind SQL injection detected',
    severity: 'high'
  },
  {
    id: 'SQL012',
    pattern: /(%27|%22)\s*(%20)*(OR|AND)(%20|\+)/i,
    description: 'URL-encoded SQL injection attempt with logical operators',
    severity: 'medium'
  },
  {
    id: 'SQL013',
    pattern: /\bINFORMATION_SCHEMA\b/i,
    description: 'Attempt to access database metadata',
    severity: 'high'
  },
  {
    id: 'SQL014',
    pattern: /xp_cmdshell|sp_executesql/i,
    description: 'SQL Server system command execution attempt',
    severity: 'high'
  },
  {
    id: 'SQL015',
    pattern: /0x[0-9a-f]+/i,
    description: 'Hexadecimal-encoded SQL injection',
    severity: 'medium'
  }
];

module.exports = sqlInjectionRules;
