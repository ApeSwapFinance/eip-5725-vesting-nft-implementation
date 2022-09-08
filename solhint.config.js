/**
 * Set the Solidity compiler version
 */
const COMPILER_VERSION = "0.8.16"

/**
 * 
 * - Github: https://github.com/protofire/solhint
 * - Supported Rules: https://github.com/protofire/solhint/blob/master/docs/rules.md
 * - Configure linter with inline comments: 
 *    https://github.com/protofire/solhint#configure-the-linter-with-comments
 * - Create a shareable solhint config through npm: 
 *    https://github.com/protofire/solhint/blob/master/docs/shareable-configs.md
 * - "error", "warn", "off" are generally the choices below
 */
module.exports = {
  "extends": "solhint:recommended",
  "plugins": [],
  "rules": {
    // Best Practice Rules
    "constructor-syntax": "warn",
    "max-line-length": ["error", 120],
    // "code-complexity": ["warn", 7], // Not included in recommended
    // "function-max-lines": [ "warn",50 ], // Not included in recommended

    // Style Guide Rules
    "func-visibility": ["error", { "ignoreConstructors": true }], // Set ignoreConstructors to true if using solidity >=0.7.0
    "reason-string": ["warn", { "maxLength": 50 }], // Revert reason length
    "func-param-name-mixedcase": "error",
    "modifier-name-mixedcase": "error",
    "private-vars-leading-underscore": ["error", { "strict": false }], 
    "ordering": "error",

    // Security Rules
    "compiler-version": ["error", COMPILER_VERSION],
    "avoid-sha3": "error",
    "avoid-suicide": "error",
    "avoid-throw": "error",
    // "not-rely-on-time": "off",
  },
}