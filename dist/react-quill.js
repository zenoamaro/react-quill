(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactQuill"] = factory();
	else
		root["ReactQuill"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports) {

	/*
	React-Quill v0.4.1
	https://github.com/zenoamaro/react-quill
	*/
	import Quill from 'quill'
	import QuillComponent from './component'
	import Mixin from './mixin'
	import ToolBar from './toolbar'
	
	const Parchment = Quill.import('parchment')
	const FontStyle = new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE })
	const FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', { scope: Parchment.Scope.INLINE })
	
	Quill.register(FontStyle, true)
	Quill.register(FontFamilyStyle, true)
	
	export { Quill }


/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-quill.js.map