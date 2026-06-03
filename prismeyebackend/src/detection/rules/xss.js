const xssRules = [
  {
    id: 'XSS001',
    pattern: /<script[^>]*>.*?<\/script>/i,
    description: 'Malicious script tag injection detected',
    severity: 'high'
  },
  {
    id: 'XSS002',
    pattern: /<script[^>]*>/i,
    description: 'Script tag opening detected in input',
    severity: 'high'
  },
  {
    id: 'XSS003',
    pattern: /javascript:/i,
    description: 'JavaScript protocol handler detected',
    severity: 'high'
  },
  {
    id: 'XSS004',
    pattern: /\bon(click|load|error|mouseover|focus|blur|submit|input|change|keydown|keyup|mouseenter|mouseleave|dblclick|contextmenu|pointerdown|touchstart)\s*=/i,
    description: 'HTML event handler injection detected',
    severity: 'high'
  },
  {
    id: 'XSS005',
    pattern: /<iframe[^>]*>/i,
    description: 'Iframe tag injection attempt',
    severity: 'high'
  },
  {
    id: 'XSS006',
    pattern: /<img[^>]*onerror/i,
    description: 'Image tag with malicious error handler',
    severity: 'high'
  },
  {
    id: 'XSS007',
    pattern: /<svg[^>]*onload/i,
    description: 'SVG element with malicious onload event',
    severity: 'high'
  },
  {
    id: 'XSS008',
    pattern: /eval\s*\(/i,
    description: 'JavaScript eval() function detected',
    severity: 'high'
  },
  {
    id: 'XSS009',
    pattern: /alert\s*\(/i,
    description: 'JavaScript alert() function in input',
    severity: 'medium'
  },
  {
    id: 'XSS010',
    pattern: /<object[^>]*>/i,
    description: 'Object tag injection detected',
    severity: 'high'
  },
  {
    id: 'XSS011',
    pattern: /<embed[^>]*>/i,
    description: 'Embed tag injection detected',
    severity: 'high'
  },
  {
    id: 'XSS012',
    pattern: /<body[^>]*onload/i,
    description: 'Body tag with malicious onload event',
    severity: 'high'
  },
  {
    id: 'XSS013',
    pattern: /document\.cookie/i,
    description: 'Attempt to steal user cookies',
    severity: 'high'
  },
  {
    id: 'XSS014',
    pattern: /%3Cscript%3E/i,
    description: 'URL-encoded script tag detected',
    severity: 'high'
  },
  {
    id: 'XSS015',
    pattern: /String\.fromCharCode/i,
    description: 'Obfuscated XSS using character codes',
    severity: 'medium'
  }
];

module.exports = xssRules;
