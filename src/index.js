/*
React-Quill v1.0.0
https://github.com/zenoamaro/react-quill
*/
var Quill = require('quill')
var Parchment = Quill.import('parchment');
var QuillStyle = Parchment.Attributor.Style;
var styleOptions = { scope: Parchment.Scope.INLINE };
Quill.register(new QuillStyle('size', 'font-size', styleOptions), true);
Quill.register(new QuillStyle('font', 'font-family', styleOptions), true);

module.exports.Quill = Quill;
module.exports = require('./component');
module.exports.Mixin = require('./mixin');
module.exports.Toolbar = require('./toolbar');
