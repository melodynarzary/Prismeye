const xxeRules = [
  {
    id: 'XXE001',
    pattern: /<!ENTITY.*SYSTEM/i,
    description: 'XML external entity with SYSTEM keyword',
    severity: 'high'
  },
  {
    id: 'XXE002',
    pattern: /<!ENTITY.*PUBLIC/i,
    description: 'XML external entity with PUBLIC keyword',
    severity: 'high'
  },
  {
    id: 'XXE003',
    pattern: /<!DOCTYPE.*\[.*<!ENTITY/is,
    description: 'DOCTYPE declaration with entity definition',
    severity: 'high'
  },
  {
    id: 'XXE004',
    pattern: /<!ENTITY.*file:\/\//i,
    description: 'XXE attack using file protocol',
    severity: 'high'
  },
  {
    id: 'XXE005',
    pattern: /<!ENTITY.*http:\/\//i,
    description: 'XXE-based SSRF attack detected',
    severity: 'high'
  },
  {
    id: 'XXE006',
    pattern: /<!ENTITY.*%.*>/i,
    description: 'Parameter entity expansion detected',
    severity: 'medium'
  },
  {
    id: 'XXE007',
    pattern: /SYSTEM\s+["'].*\.dtd/i,
    description: 'External DTD reference detected',
    severity: 'medium'
  },
  {
    id: 'XXE008',
    pattern: /<!ENTITY.*php:\/\//i,
    description: 'XXE with PHP wrapper exploitation',
    severity: 'high'
  }
];

module.exports = xxeRules;

