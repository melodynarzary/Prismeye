const sqlInjectionRules = require('./sqlInjection');
const xssRules = require('./xss');
const ssrfRules = require('./ssrf');
const commandInjectionRules = require('./commandInjection');
const pathTraversalRules = require('./pathTraversal');
const localFileInclusionRules = require('./localFileInclusion');
const xxeRules = require('./xxe');
const nosqlInjectionRules = require('./nosqlInjection');

module.exports = {
  sqlInjectionRules,
  xssRules,
  ssrfRules,
  commandInjectionRules,
  pathTraversalRules,
  localFileInclusionRules,
  xxeRules,
  nosqlInjectionRules
};
