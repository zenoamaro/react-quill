/*
React-Quill v0.4.1
https://github.com/zenoamaro/react-quill
*/
module.exports = require('./component');
module.exports.Mixin = require('./mixin');
var quill = require('quill')
var Parchment = quill.import('parchment');
var FontStyle = new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE });
var FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', { scope: Parchment.Scope.INLINE });
quill.register(FontStyle, true);
quill.register(FontFamilyStyle, true);
module.exports.Quill = quill;
