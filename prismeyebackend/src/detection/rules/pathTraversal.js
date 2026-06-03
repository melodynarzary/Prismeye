const localFileInclusionRules = [

  {
    id: 'PT001',
    pattern: /php:\/\/filter/i,
    description: 'PHP filter wrapper exploitation attempt',
    severity: 'high'
  },
  {
    id: 'PT002',
    pattern: /php:\/\/input/i,
    description: 'PHP input stream wrapper detected',
    severity: 'high'
  },
  {
    id: 'PT003',
    pattern: /expect:\/\//i,
    description: 'Expect wrapper for command execution',
    severity: 'high'
  },
  {
    id: 'PT004',
    pattern: /data:\/\/|data:text/i,
    description: 'Data URI wrapper exploitation detected',
    severity: 'high'
  },
  {
    id: 'PT009',
    pattern: /phar:\/\//i,
    description: 'PHAR archive wrapper detected',
    severity: 'medium'
  },
  {
    id: 'PT010',
    pattern: /zip:\/\//i,
    description: 'ZIP wrapper for file inclusion',
    severity: 'low'
  },

  {
    id: 'PT005',
    pattern: /file:\/\/\/etc\/passwd/i,
    description: 'File protocol used to access system files',
    severity: 'high'
  },
  {
    id: 'PT006',
    pattern: /\/proc\/self\/environ/i,
    description: 'Attempt to access process environment variables',
    severity: 'high'
  },

  {
    id: 'PT007',
    pattern: /\/var\/log\//i,
    description: 'Attempt to include server log files',
    severity: 'medium'
  },

  {
    id: 'PT008',
    pattern: /(\.\.\/)+(etc|var|usr|proc)/i,
    description: 'Relative path to sensitive system directories',
    severity: 'high'
  }

];

module.exports = localFileInclusionRules;