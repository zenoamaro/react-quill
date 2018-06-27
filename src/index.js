/*
React-Quill v1.0.0
https://github.com/zenoamaro/react-quill
*/
import Quill from 'quill';
import Component from './component' ;
import Mixin from './mixin';
import Toolbar from './toolbar';

// For legacy API compatibility, define CommonJS export:
module.exports = Component;
module.exports.Mixin = Mixin;
module.exports.Toolbar = Toolbar;
module.exports.Quill = Quill;

export {
  Mixin,
  Toolbar,
  Quill
};

export default Component;
