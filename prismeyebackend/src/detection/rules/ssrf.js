const ssrfRules = [
  {
    id: 'SSRF001',
    pattern: /https?:\/\/(localhost|127\.0\.0\.1)/i,
    description: 'Attempt to access localhost resources',
    severity: 'high'
  },
  {
    id: 'SSRF002',
    pattern: /https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
    description: 'Access to private IP range 10.x.x.x detected',
    severity: 'high'
  },
  {
    id: 'SSRF003',
    pattern: /https?:\/\/(192\.168\.\d{1,3}\.\d{1,3})/i,
    description: 'Access to private IP range 192.168.x.x detected',
    severity: 'high'
  },
  {
    id: 'SSRF004',
    pattern: /https?:\/\/(172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3})/i,
    description: 'Access to private IP range 172.16-31.x.x detected',
    severity: 'high'
  },
  {
    id: 'SSRF005',
    pattern: /file:\/\//i,
    description: 'File protocol access attempt detected',
    severity: 'high'
  },
  {
    id: 'SSRF006',
    pattern: /gopher:\/\//i,
    description: 'Gopher protocol exploitation attempt',
    severity: 'high'
  },
  {
    id: 'SSRF007',
    pattern: /dict:\/\//i,
    description: 'Dict protocol exploitation detected',
    severity: 'medium'
  },
  {
    id: 'SSRF008',
    pattern: /@(localhost|127\.0\.0\.1)/i,
    description: 'URL with embedded localhost credentials',
    severity: 'high'
  },
  {
    id: 'SSRF009',
    pattern: /169\.254\.\d{1,3}\.\d{1,3}/,
    description: 'AWS metadata service access attempt',
    severity: 'high'
  },
  {
    id: 'SSRF010',
    pattern: /metadata\.google\.internal/i,
    description: 'GCP metadata endpoint access attempt',
    severity: 'high'
  },
  {
    id: 'SSRF011',
    pattern: /0\.0\.0\.0|0x7f000001/i,
    description: 'Alternative localhost representation detected',
    severity: 'high'
  },
  {
    id: 'SSRF012',
    pattern: /metadata\.azure\.com/i,
    description: 'Azure metadata service access attempt',
    severity: 'high'
  }
];

module.exports = ssrfRules;