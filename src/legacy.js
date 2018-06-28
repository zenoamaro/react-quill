/*
React-Quill v1.0.0
https://github.com/zenoamaro/react-quill
*/

// For legacy API compatibility, define CommonJS export:
module.exports = require('./component');
module.exports.Mixin = require('./mixin');
module.exports.Toolbar = require('./toolbar');
module.exports.Quill = require('./quill');

// Define `default` For ES Module compatibility
// This should only be used if the ES Modules in `lib` aren't discovered
module.exports.default = require('./component');
