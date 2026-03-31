const localFileInclusionRules = [
  {
    id: 'LFI001',
    pattern: /php:\/\/filter/i,
    description: 'PHP filter wrapper exploitation attempt',
    severity: 'high'
  },
  {
    id: 'LFI002',
    pattern: /php:\/\/input/i,
    description: 'PHP input stream wrapper detected',
    severity: 'high'
  },
  {
    id: 'LFI003',
    pattern: /expect:\/\//i,
    description: 'Expect wrapper for command execution',
    severity: 'high'
  },
  {
    id: 'LFI004',
    pattern: /data:\/\/|data:text/i,
    description: 'Data URI wrapper exploitation detected',
    severity: 'high'
  },
  {
    id: 'LFI005',
    pattern: /file:\/\/\/etc\/passwd/i,
    description: 'File protocol used to access system files',
    severity: 'high'
  },
  {
    id: 'LFI006',
    pattern: /\/proc\/self\/environ/i,
    description: 'Attempt to access process environment variables',
    severity: 'high'
  },
  {
    id: 'LFI007',
    pattern: /\/var\/log\//i,
    description: 'Attempt to include server log files',
    severity: 'medium'
  },
  {
    id: 'LFI008',
    pattern: /\.\/(etc|var|usr|proc)/i,
    description: 'Relative path to sensitive system directories',
    severity: 'high'
  },
  {
    id: 'LFI009',
    pattern: /phar:\/\//i,
    description: 'PHAR archive wrapper detected',
    severity: 'medium'
  },
  {
    id: 'LFI010',
    pattern: /zip:\/\//i,
    description: 'ZIP wrapper for file inclusion',
    severity: 'low'
  }
];

module.exports = localFileInclusionRules;