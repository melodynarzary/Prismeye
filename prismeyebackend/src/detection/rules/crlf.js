const crlfRules = [
  {
    id: 'CRLF001',
    pattern: /(%0d%0a|%0D%0A)/i,
    description: 'URL-encoded CRLF sequence detected (%0d%0a)',
    severity: 'medium'
  },
  {
    id: 'CRLF002',
    pattern: /(%0a|%0d)/i,
    description: 'URL-encoded CR or LF character detected',
    severity: 'low'
  },
  {
    id: 'CRLF003',
    pattern: /\r\n(Set-Cookie|Location|Content-Type|Content-Length|HTTP\/)/i,
    description: 'HTTP response splitting via CRLF injection',
    severity: 'high'
  },
  {
    id: 'CRLF004',
    pattern: /\r\n\r\n/,
    description: 'Double CRLF detected — possible HTTP response splitting',
    severity: 'high'
  },
  {
    id: 'CRLF005',
    pattern: /(%0d%0a|%0D%0A).*(Set-Cookie|Location|Content-Type)/i,
    description: 'CRLF injection attempting to set HTTP headers',
    severity: 'high'
  },
  {
    id: 'CRLF006',
    pattern: /(%0a|%0d).*(Set-Cookie|Location|Content-Type|HTTP)/i,
    description: 'Single CR or LF used to inject HTTP headers',
    severity: 'medium'
  },
  {
    id: 'CRLF007',
    pattern: /(\\r\\n|\\n|\\r).*(Set-Cookie|Location|Content-Type)/i,
    description: 'Escaped newline characters used for header injection',
    severity: 'medium'
  },
  {
    id: 'CRLF008',
    pattern: /(%23|#).*(%0a|%0d|%0d%0a)/i,
    description: 'Fragment identifier combined with CRLF — log injection attempt',
    severity: 'low'
  },
  {
    id: 'CRLF009',
    pattern: /\r\n(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s/i,
    description: 'HTTP request smuggling via CRLF injection',
    severity: 'high'
  },
  {
    id: 'CRLF010',
    pattern: /(%0d%0a){2,}/i,
    description: 'Multiple CRLF sequences — likely header/body splitting attempt',
    severity: 'high'
  },
  {
    id: 'CRLF011',
    pattern: /(location|set-cookie|content-type)(\s*):%0d%0a/i,
    description: 'Header name followed by encoded CRLF — direct header injection',
    severity: 'high'
  },
  {
    id: 'CRLF012',
    pattern: /%E5%98%8A|%E5%98%8D/i,
    description: 'Unicode-encoded newline characters used to bypass CRLF filters',
    severity: 'medium'
  },
  {
    id: 'CRLF013',
    pattern: /\u000d|\u000a/,
    description: 'Raw Unicode CR or LF character in input',
    severity: 'low'
  },
  {
    id: 'CRLF014',
    pattern: /%0aContent-Length/i,
    description: 'LF injection to manipulate Content-Length header',
    severity: 'high'
  },
  {
    id: 'CRLF015',
    pattern: /%0d%0aHTTP\//i,
    description: 'CRLF followed by HTTP version — response splitting attempt',
    severity: 'high'
  },
];

module.exports = crlfRules;