/*
React-Quill v0.4.1
https://github.com/zenoamaro/react-quill
*/
module.exports.Component = require('./component');
module.exports.Mixin = require('./mixin');
module.exports.Toolbar = require('./toolbar');
var quill = require('quill')
var Parchment = quill.import('parchment');
var FontStyle = new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE });
quill.register(FontStyle, true);
module.exports.Quill = quill;
