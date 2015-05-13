(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "quill"], factory);
	else if(typeof exports === 'object')
		exports["ReactQuill"] = factory(require("react"), require("quill"));
	else
		root["ReactQuill"] = factory(root["React"], root["Quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/***/ function(module, exports, __webpack_require__) {

	/*
	React-Quill v0.0.3
	https://github.com/zenoamaro/react-quill
	*/
	module.exports = __webpack_require__(/*! ./component */ 1);
	module.exports.Mixin = __webpack_require__(/*! ./mixin */ 4);
	module.exports.Toolbar = __webpack_require__(/*! ./toolbar */ 3);


/***/ },
/* 1 */
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 2),
		QuillToolbar = __webpack_require__(/*! ./toolbar */ 3),
		QuillMixin = __webpack_require__(/*! ./mixin */ 4),
		T = React.PropTypes;
	
	// Support React 0.11 and 0.12
	// FIXME: Remove with React 0.13
	if (React.createFactory) {
		QuillToolbar = React.createFactory(QuillToolbar);
	}
	
	var QuillComponent = React.createClass({
	
		displayName: 'Quill',
	
		mixins: [ QuillMixin ],
	
		propTypes: {
			id:           T.string,
			className:    T.string,
			value:        T.string,
			defaultValue: T.string,
			readOnly:     T.bool,
			toolbar:      T.array,
			formats:      T.array,
			styles:       T.object,
			theme:        T.string,
			pollInterval: T.number,
			onChange:     T.func
		},
	
		getDefaultProps: function() {
			return {
				className: '',
				theme: 'base',
				modules: {}
			};
		},
	
		/*
		Retrieve the initial value from either `value` (preferred)
		or `defaultValue` if you want an un-controlled component.
		*/
		getInitialState: function() {
			return {};
		},
	
		/*
		Update only if we've been passed a new `value`.
		This leaves components using `defaultValue` alone.
		*/
		componentWillReceiveProps: function(nextProps) {
			if ('value' in nextProps) {
				if (nextProps.value !== this.props.value) {
					this.setEditorContents(this.state.editor, nextProps.value);
				}
			}
		},
	
		componentDidMount: function() {
			var editor = this.createEditor(
				this.getEditorElement(),
				this.getEditorConfig());
			this.setState({ editor:editor });
		},
	
		componentWillUnmount: function() {
			this.destroyEditor(this.state.editor);
			// NOTE: Don't set the state to null here
			//       as it would generate a loop.
		},
	
		shouldComponentUpdate: function(nextProps, nextState) {
			// Never re-render or we lose the element.
			return false;
		},
	
		/*
		If for whatever reason we are rendering again,
		we should tear down the editor and bring it up
		again.
		*/
		componentWillUpdate: function() {
			this.componentWillUnmount();
		},
	
		componentDidUpdate: function() {
			this.componentDidMount();
		},
	
		getEditorConfig: function() {
			var config = {
				readOnly:     this.props.readOnly,
				theme:        this.props.theme,
				formats:      this.props.formats,
				styles:       this.props.styles,
				modules:      this.props.modules,
				pollInterval: this.props.pollInterval
			};
			// Unless we're redefining the toolbar,
			// attach to the default one as a ref.
			if (!config.modules.toolbar) {
				// Don't mutate the original modules
				// because it's shared between components.
				config.modules = JSON.parse(JSON.stringify(config.modules));
				config.modules.toolbar = {
					container: this.refs.toolbar.getDOMNode()
				};
			}
			return config;
		},
	
		getEditorElement: function() {
			return this.refs.editor.getDOMNode();
		},
	
		getEditorContents: function() {
			return this.props.value || this.props.defaultValue || '';
		},
	
		getClassName: function() {
			return ['quill', this.props.className].join(' ');
		},
	
		/*
		Renders either the specified contents, or a default
		configuration of toolbar and contents area.
		*/
		renderContents: function() {
			if (React.Children.count(this.props.children)) {
				return this.props.children;
			} else {
				return [
					QuillToolbar({
						key:'toolbar',
						ref:'toolbar',
						items: this.props.toolbar
					}),
					React.DOM.div({
						key:'editor',
						ref:'editor',
						className: 'quill-contents',
						dangerouslySetInnerHTML: { __html:this.getEditorContents() }
					})
				];
			}
		},
	
		render: function() {
			return React.DOM.div({
				className: this.getClassName(),
				onChange: this.preventDefault },
				this.renderContents()
			);
		},
	
		/*
		Updates the local state with the new contents,
		executes the change handler passed as props.
		*/
		onEditorChange: function(value) {
			if (value !== this.state.value) {
				if (this.props.onChange) {
					this.props.onChange(value);
				}
			}
		},
	
		/*
		Stop change events from the toolbar from
		bubbling up outside.
		*/
		preventDefault: function(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	
	});
	
	module.exports = QuillComponent;


/***/ },
/* 2 */
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/*!************************!*\
  !*** ./src/toolbar.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 2),
		T = React.PropTypes;
	
	var defaultColors = [
		'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
		'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
		'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
		'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
		'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
		'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
		'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
		'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
		'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
		'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
		'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
		'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
	].map(function(color){ return { value: color } });
	
	var defaultItems = [
	
		{ label:'Formats', type:'group', items: [
			{ label:'Size', type:'size', items: [
				{ label:'Normal', value:'' },
				{ label:'Smaller', value:'0.8em' },
				{ label:'Larger', value:'1.4em' },
				{ label:'Huge', value:'2em' }
			]},
			{ label:'Alignment', type:'align', items: [
				{ label:'Center', value:'center' },
				{ label:'Left', value:'left' },
				{ label:'Right', value:'right' },
				{ label:'Justify', value:'justify' }
			]}
		]},
	
		{ label:'Text', type:'group', items: [
			{ type:'bold', label:'Bold' },
			{ type:'italic', label:'Italic' },
			{ type:'strike', label:'Strike' },
			{ type:'underline', label:'Underline' },
			{ type:'link', label:'Link' },
			{ type:'color', label:'Color', items:defaultColors },
		]},
	
		{ label:'Blocks', type:'group', items: [
			{ type:'bullet', label:'Bullet' },
			{ type:'list', label:'List' }
		]}
	
	];
	
	var QuillToolbar = React.createClass({
	
		displayName: 'Quill Toolbar',
	
		propTypes: {
			id:        T.string,
			className: T.string,
			items:     T.array
		},
	
		getDefaultProps: function(){
			return {
				items: defaultItems
			};
		},
	
		renderSeparator: function(item) {
			return React.DOM.span({
				className:'ql-format-separator'
			});
		},
	
		renderGroup: function(item) {
			return React.DOM.span({
				key: item.label,
				className:'ql-format-group' },
				item.items.map(this.renderItem)
			);
		},
	
		renderChoiceItem: function(item) {
			return React.DOM.option({
				key: item.label || item.value,
				value:item.value },
				item.label
			);
		},
	
		renderChoices: function(item) {
			return React.DOM.select({
				key: item.label,
				className: 'ql-'+item.type },
				item.items.map(this.renderChoiceItem)
			);
		},
	
		renderAction: function(item) {
			return React.DOM.span({
				key: item.label || item.value,
				className: 'ql-format-button ql-'+item.type,
				title: item.label }
			);
		},
	
		renderItem: function(item) {
			switch (item.type) {
				case 'separator':
					return this.renderSeparator();
				case 'group':
					return this.renderGroup(item);
				case 'align':
				case 'size':
				case 'color':
				case 'background':
					return this.renderChoices(item);
				default:
					return this.renderAction(item);
			}
		},
	
		getClassName: function() {
			return 'quill-toolbar ' + (this.props.className||'');
		},
	
		render: function() {
			return React.DOM.div({
				className: this.getClassName() },
				this.props.items.map(this.renderItem)
			);
		}
	
	});
	
	module.exports = QuillToolbar;
	QuillToolbar.defaultItems = defaultItems;
	QuillToolbar.defaultColors = defaultColors;

/***/ },
/* 4 */
/*!**********************!*\
  !*** ./src/mixin.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Quill = __webpack_require__(/*! quill */ 5);
	
	var QuillMixin = {
	
		/**
		Creates an editor on the given element. The editor will
		be passed the configuration, have its events bound,
		*/
		createEditor: function($el, config) {
			var editor = new Quill($el, config);
			this.hookEditor(editor);
			return editor;
		},
	
		hookEditor: function(editor) {
			var self = this;
			editor.on('text-change', function(delta, source) {
				if (self.onEditorChange) {
					self.onEditorChange(editor.getHTML(), delta, source);
				}
			});
		},
	
		updateEditor: function(editor, config) {
			// NOTE: This tears the editor down, and reinitializes
			//       it with the new config. Ugly but necessary
			//       as there is no api for updating it.
			this.destroyEditor(editor);
			this.createEditor(config);
			return editor;
		},
	
		destroyEditor: function(editor) {
			editor.destroy();
		},
	
		/*
		Replace the contents of the editor, but keep
		the previous selection hanging around so that
		the cursor won't move.
		*/
		setEditorContents: function(editor, value) {
			var sel = editor.getSelection();
			editor.setHTML(value);
			editor.setSelection(sel);
		}
	
	};
	
	module.exports = QuillMixin;

/***/ },
/* 5 */
/*!**************************************************************************************!*\
  !*** external {"commonjs":"quill","commonjs2":"quill","amd":"quill","root":"Quill"} ***!
  \**************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4MGQyMmUxNzdiMDFmMjc5MjRhMiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInJlYWN0XCIsXCJjb21tb25qczJcIjpcInJlYWN0XCIsXCJhbWRcIjpcInJlYWN0XCIsXCJyb290XCI6XCJSZWFjdFwifSIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbGJhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVG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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0gsR0FBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7O0FBRUY7QUFDQTtBQUNBLEdBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNkI7Ozs7Ozs7OztBQ25EQSxnRCIsImZpbGUiOiIuL2Rpc3QvcmVhY3QtcXVpbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJyZWFjdFwiKSwgcmVxdWlyZShcInF1aWxsXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInJlYWN0XCIsIFwicXVpbGxcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiUmVhY3RRdWlsbFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlJlYWN0UXVpbGxcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSwgcm9vdFtcIlF1aWxsXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzVfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgODBkMjJlMTc3YjAxZjI3OTI0YTJcbiAqKi8iLCIvKlxuUmVhY3QtUXVpbGwgdjAuMC4zXG5odHRwczovL2dpdGh1Yi5jb20vemVub2FtYXJvL3JlYWN0LXF1aWxsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpO1xubW9kdWxlLmV4cG9ydHMuTWl4aW4gPSByZXF1aXJlKCcuL21peGluJyk7XG5tb2R1bGUuZXhwb3J0cy5Ub29sYmFyID0gcmVxdWlyZSgnLi90b29sYmFyJyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRRdWlsbFRvb2xiYXIgPSByZXF1aXJlKCcuL3Rvb2xiYXInKSxcblx0UXVpbGxNaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKSxcblx0VCA9IFJlYWN0LlByb3BUeXBlcztcblxuLy8gU3VwcG9ydCBSZWFjdCAwLjExIGFuZCAwLjEyXG4vLyBGSVhNRTogUmVtb3ZlIHdpdGggUmVhY3QgMC4xM1xuaWYgKFJlYWN0LmNyZWF0ZUZhY3RvcnkpIHtcblx0UXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShRdWlsbFRvb2xiYXIpO1xufVxuXG52YXIgUXVpbGxDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdRdWlsbCcsXG5cblx0bWl4aW5zOiBbIFF1aWxsTWl4aW4gXSxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRpZDogICAgICAgICAgIFQuc3RyaW5nLFxuXHRcdGNsYXNzTmFtZTogICAgVC5zdHJpbmcsXG5cdFx0dmFsdWU6ICAgICAgICBULnN0cmluZyxcblx0XHRkZWZhdWx0VmFsdWU6IFQuc3RyaW5nLFxuXHRcdHJlYWRPbmx5OiAgICAgVC5ib29sLFxuXHRcdHRvb2xiYXI6ICAgICAgVC5hcnJheSxcblx0XHRmb3JtYXRzOiAgICAgIFQuYXJyYXksXG5cdFx0c3R5bGVzOiAgICAgICBULm9iamVjdCxcblx0XHR0aGVtZTogICAgICAgIFQuc3RyaW5nLFxuXHRcdHBvbGxJbnRlcnZhbDogVC5udW1iZXIsXG5cdFx0b25DaGFuZ2U6ICAgICBULmZ1bmNcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjbGFzc05hbWU6ICcnLFxuXHRcdFx0dGhlbWU6ICdiYXNlJyxcblx0XHRcdG1vZHVsZXM6IHt9XG5cdFx0fTtcblx0fSxcblxuXHQvKlxuXHRSZXRyaWV2ZSB0aGUgaW5pdGlhbCB2YWx1ZSBmcm9tIGVpdGhlciBgdmFsdWVgIChwcmVmZXJyZWQpXG5cdG9yIGBkZWZhdWx0VmFsdWVgIGlmIHlvdSB3YW50IGFuIHVuLWNvbnRyb2xsZWQgY29tcG9uZW50LlxuXHQqL1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7fTtcblx0fSxcblxuXHQvKlxuXHRVcGRhdGUgb25seSBpZiB3ZSd2ZSBiZWVuIHBhc3NlZCBhIG5ldyBgdmFsdWVgLlxuXHRUaGlzIGxlYXZlcyBjb21wb25lbnRzIHVzaW5nIGBkZWZhdWx0VmFsdWVgIGFsb25lLlxuXHQqL1xuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRpZiAoJ3ZhbHVlJyBpbiBuZXh0UHJvcHMpIHtcblx0XHRcdGlmIChuZXh0UHJvcHMudmFsdWUgIT09IHRoaXMucHJvcHMudmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRFZGl0b3JDb250ZW50cyh0aGlzLnN0YXRlLmVkaXRvciwgbmV4dFByb3BzLnZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcihcblx0XHRcdHRoaXMuZ2V0RWRpdG9yRWxlbWVudCgpLFxuXHRcdFx0dGhpcy5nZXRFZGl0b3JDb25maWcoKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGVkaXRvcjplZGl0b3IgfSk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZGVzdHJveUVkaXRvcih0aGlzLnN0YXRlLmVkaXRvcik7XG5cdFx0Ly8gTk9URTogRG9uJ3Qgc2V0IHRoZSBzdGF0ZSB0byBudWxsIGhlcmVcblx0XHQvLyAgICAgICBhcyBpdCB3b3VsZCBnZW5lcmF0ZSBhIGxvb3AuXG5cdH0sXG5cblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuXHRcdC8vIE5ldmVyIHJlLXJlbmRlciBvciB3ZSBsb3NlIHRoZSBlbGVtZW50LlxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHQvKlxuXHRJZiBmb3Igd2hhdGV2ZXIgcmVhc29uIHdlIGFyZSByZW5kZXJpbmcgYWdhaW4sXG5cdHdlIHNob3VsZCB0ZWFyIGRvd24gdGhlIGVkaXRvciBhbmQgYnJpbmcgaXQgdXBcblx0YWdhaW4uXG5cdCovXG5cdGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcblx0fSxcblxuXHRnZXRFZGl0b3JDb25maWc6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb25maWcgPSB7XG5cdFx0XHRyZWFkT25seTogICAgIHRoaXMucHJvcHMucmVhZE9ubHksXG5cdFx0XHR0aGVtZTogICAgICAgIHRoaXMucHJvcHMudGhlbWUsXG5cdFx0XHRmb3JtYXRzOiAgICAgIHRoaXMucHJvcHMuZm9ybWF0cyxcblx0XHRcdHN0eWxlczogICAgICAgdGhpcy5wcm9wcy5zdHlsZXMsXG5cdFx0XHRtb2R1bGVzOiAgICAgIHRoaXMucHJvcHMubW9kdWxlcyxcblx0XHRcdHBvbGxJbnRlcnZhbDogdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWxcblx0XHR9O1xuXHRcdC8vIFVubGVzcyB3ZSdyZSByZWRlZmluaW5nIHRoZSB0b29sYmFyLFxuXHRcdC8vIGF0dGFjaCB0byB0aGUgZGVmYXVsdCBvbmUgYXMgYSByZWYuXG5cdFx0aWYgKCFjb25maWcubW9kdWxlcy50b29sYmFyKSB7XG5cdFx0XHQvLyBEb24ndCBtdXRhdGUgdGhlIG9yaWdpbmFsIG1vZHVsZXNcblx0XHRcdC8vIGJlY2F1c2UgaXQncyBzaGFyZWQgYmV0d2VlbiBjb21wb25lbnRzLlxuXHRcdFx0Y29uZmlnLm1vZHVsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNvbmZpZy5tb2R1bGVzKSk7XG5cdFx0XHRjb25maWcubW9kdWxlcy50b29sYmFyID0ge1xuXHRcdFx0XHRjb250YWluZXI6IHRoaXMucmVmcy50b29sYmFyLmdldERPTU5vZGUoKVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbmZpZztcblx0fSxcblxuXHRnZXRFZGl0b3JFbGVtZW50OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5yZWZzLmVkaXRvci5nZXRET01Ob2RlKCk7XG5cdH0sXG5cblx0Z2V0RWRpdG9yQ29udGVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnZhbHVlIHx8IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlIHx8ICcnO1xuXHR9LFxuXG5cdGdldENsYXNzTmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFsncXVpbGwnLCB0aGlzLnByb3BzLmNsYXNzTmFtZV0uam9pbignICcpO1xuXHR9LFxuXG5cdC8qXG5cdFJlbmRlcnMgZWl0aGVyIHRoZSBzcGVjaWZpZWQgY29udGVudHMsIG9yIGEgZGVmYXVsdFxuXHRjb25maWd1cmF0aW9uIG9mIHRvb2xiYXIgYW5kIGNvbnRlbnRzIGFyZWEuXG5cdCovXG5cdHJlbmRlckNvbnRlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoUmVhY3QuQ2hpbGRyZW4uY291bnQodGhpcy5wcm9wcy5jaGlsZHJlbikpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRRdWlsbFRvb2xiYXIoe1xuXHRcdFx0XHRcdGtleTondG9vbGJhcicsXG5cdFx0XHRcdFx0cmVmOid0b29sYmFyJyxcblx0XHRcdFx0XHRpdGVtczogdGhpcy5wcm9wcy50b29sYmFyXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtcblx0XHRcdFx0XHRrZXk6J2VkaXRvcicsXG5cdFx0XHRcdFx0cmVmOidlZGl0b3InLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ3F1aWxsLWNvbnRlbnRzJyxcblx0XHRcdFx0XHRkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6dGhpcy5nZXRFZGl0b3JDb250ZW50cygpIH1cblx0XHRcdFx0fSlcblx0XHRcdF07XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5kaXYoe1xuXHRcdFx0Y2xhc3NOYW1lOiB0aGlzLmdldENsYXNzTmFtZSgpLFxuXHRcdFx0b25DaGFuZ2U6IHRoaXMucHJldmVudERlZmF1bHQgfSxcblx0XHRcdHRoaXMucmVuZGVyQ29udGVudHMoKVxuXHRcdCk7XG5cdH0sXG5cblx0Lypcblx0VXBkYXRlcyB0aGUgbG9jYWwgc3RhdGUgd2l0aCB0aGUgbmV3IGNvbnRlbnRzLFxuXHRleGVjdXRlcyB0aGUgY2hhbmdlIGhhbmRsZXIgcGFzc2VkIGFzIHByb3BzLlxuXHQqL1xuXHRvbkVkaXRvckNoYW5nZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG5cdFx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKlxuXHRTdG9wIGNoYW5nZSBldmVudHMgZnJvbSB0aGUgdG9vbGJhciBmcm9tXG5cdGJ1YmJsaW5nIHVwIG91dHNpZGUuXG5cdCovXG5cdHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbihldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpbGxDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwicmVhY3RcIixcImNvbW1vbmpzMlwiOlwicmVhY3RcIixcImFtZFwiOlwicmVhY3RcIixcInJvb3RcIjpcIlJlYWN0XCJ9XG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xuXG52YXIgZGVmYXVsdENvbG9ycyA9IFtcblx0J3JnYiggIDAsICAgMCwgICAwKScsICdyZ2IoMjMwLCAgIDAsICAgMCknLCAncmdiKDI1NSwgMTUzLCAgIDApJyxcblx0J3JnYigyNTUsIDI1NSwgICAwKScsICdyZ2IoICAwLCAxMzgsICAgMCknLCAncmdiKCAgMCwgMTAyLCAyMDQpJyxcblx0J3JnYigxNTMsICA1MSwgMjU1KScsICdyZ2IoMjU1LCAyNTUsIDI1NSknLCAncmdiKDI1MCwgMjA0LCAyMDQpJyxcblx0J3JnYigyNTUsIDIzNSwgMjA0KScsICdyZ2IoMjU1LCAyNTUsIDIwNCknLCAncmdiKDIwNCwgMjMyLCAyMDQpJyxcblx0J3JnYigyMDQsIDIyNCwgMjQ1KScsICdyZ2IoMjM1LCAyMTQsIDI1NSknLCAncmdiKDE4NywgMTg3LCAxODcpJyxcblx0J3JnYigyNDAsIDEwMiwgMTAyKScsICdyZ2IoMjU1LCAxOTQsIDEwMiknLCAncmdiKDI1NSwgMjU1LCAxMDIpJyxcblx0J3JnYigxMDIsIDE4NSwgMTAyKScsICdyZ2IoMTAyLCAxNjMsIDIyNCknLCAncmdiKDE5NCwgMTMzLCAyNTUpJyxcblx0J3JnYigxMzYsIDEzNiwgMTM2KScsICdyZ2IoMTYxLCAgIDAsICAgMCknLCAncmdiKDE3OCwgMTA3LCAgIDApJyxcblx0J3JnYigxNzgsIDE3OCwgICAwKScsICdyZ2IoICAwLCAgOTcsICAgMCknLCAncmdiKCAgMCwgIDcxLCAxNzgpJyxcblx0J3JnYigxMDcsICAzNiwgMTc4KScsICdyZ2IoIDY4LCAgNjgsICA2OCknLCAncmdiKCA5MiwgICAwLCAgIDApJyxcblx0J3JnYigxMDIsICA2MSwgICAwKScsICdyZ2IoMTAyLCAxMDIsICAgMCknLCAncmdiKCAgMCwgIDU1LCAgIDApJyxcblx0J3JnYiggIDAsICA0MSwgMTAyKScsICdyZ2IoIDYxLCAgMjAsICAxMCknLFxuXS5tYXAoZnVuY3Rpb24oY29sb3IpeyByZXR1cm4geyB2YWx1ZTogY29sb3IgfSB9KTtcblxudmFyIGRlZmF1bHRJdGVtcyA9IFtcblxuXHR7IGxhYmVsOidGb3JtYXRzJywgdHlwZTonZ3JvdXAnLCBpdGVtczogW1xuXHRcdHsgbGFiZWw6J1NpemUnLCB0eXBlOidzaXplJywgaXRlbXM6IFtcblx0XHRcdHsgbGFiZWw6J05vcm1hbCcsIHZhbHVlOicnIH0sXG5cdFx0XHR7IGxhYmVsOidTbWFsbGVyJywgdmFsdWU6JzAuOGVtJyB9LFxuXHRcdFx0eyBsYWJlbDonTGFyZ2VyJywgdmFsdWU6JzEuNGVtJyB9LFxuXHRcdFx0eyBsYWJlbDonSHVnZScsIHZhbHVlOicyZW0nIH1cblx0XHRdfSxcblx0XHR7IGxhYmVsOidBbGlnbm1lbnQnLCB0eXBlOidhbGlnbicsIGl0ZW1zOiBbXG5cdFx0XHR7IGxhYmVsOidDZW50ZXInLCB2YWx1ZTonY2VudGVyJyB9LFxuXHRcdFx0eyBsYWJlbDonTGVmdCcsIHZhbHVlOidsZWZ0JyB9LFxuXHRcdFx0eyBsYWJlbDonUmlnaHQnLCB2YWx1ZToncmlnaHQnIH0sXG5cdFx0XHR7IGxhYmVsOidKdXN0aWZ5JywgdmFsdWU6J2p1c3RpZnknIH1cblx0XHRdfVxuXHRdfSxcblxuXHR7IGxhYmVsOidUZXh0JywgdHlwZTonZ3JvdXAnLCBpdGVtczogW1xuXHRcdHsgdHlwZTonYm9sZCcsIGxhYmVsOidCb2xkJyB9LFxuXHRcdHsgdHlwZTonaXRhbGljJywgbGFiZWw6J0l0YWxpYycgfSxcblx0XHR7IHR5cGU6J3N0cmlrZScsIGxhYmVsOidTdHJpa2UnIH0sXG5cdFx0eyB0eXBlOid1bmRlcmxpbmUnLCBsYWJlbDonVW5kZXJsaW5lJyB9LFxuXHRcdHsgdHlwZTonbGluaycsIGxhYmVsOidMaW5rJyB9LFxuXHRcdHsgdHlwZTonY29sb3InLCBsYWJlbDonQ29sb3InLCBpdGVtczpkZWZhdWx0Q29sb3JzIH0sXG5cdF19LFxuXG5cdHsgbGFiZWw6J0Jsb2NrcycsIHR5cGU6J2dyb3VwJywgaXRlbXM6IFtcblx0XHR7IHR5cGU6J2J1bGxldCcsIGxhYmVsOidCdWxsZXQnIH0sXG5cdFx0eyB0eXBlOidsaXN0JywgbGFiZWw6J0xpc3QnIH1cblx0XX1cblxuXTtcblxudmFyIFF1aWxsVG9vbGJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1F1aWxsIFRvb2xiYXInLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGlkOiAgICAgICAgVC5zdHJpbmcsXG5cdFx0Y2xhc3NOYW1lOiBULnN0cmluZyxcblx0XHRpdGVtczogICAgIFQuYXJyYXlcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGl0ZW1zOiBkZWZhdWx0SXRlbXNcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlclNlcGFyYXRvcjogZnVuY3Rpb24oaXRlbSkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7XG5cdFx0XHRjbGFzc05hbWU6J3FsLWZvcm1hdC1zZXBhcmF0b3InXG5cdFx0fSk7XG5cdH0sXG5cblx0cmVuZGVyR3JvdXA6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOidxbC1mb3JtYXQtZ3JvdXAnIH0sXG5cdFx0XHRpdGVtLml0ZW1zLm1hcCh0aGlzLnJlbmRlckl0ZW0pXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5vcHRpb24oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsIHx8IGl0ZW0udmFsdWUsXG5cdFx0XHR2YWx1ZTppdGVtLnZhbHVlIH0sXG5cdFx0XHRpdGVtLmxhYmVsXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VzOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zZWxlY3Qoe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOiAncWwtJytpdGVtLnR5cGUgfSxcblx0XHRcdGl0ZW0uaXRlbXMubWFwKHRoaXMucmVuZGVyQ2hvaWNlSXRlbSlcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckFjdGlvbjogZnVuY3Rpb24oaXRlbSkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YWx1ZSxcblx0XHRcdGNsYXNzTmFtZTogJ3FsLWZvcm1hdC1idXR0b24gcWwtJytpdGVtLnR5cGUsXG5cdFx0XHR0aXRsZTogaXRlbS5sYWJlbCB9XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0c3dpdGNoIChpdGVtLnR5cGUpIHtcblx0XHRcdGNhc2UgJ3NlcGFyYXRvcic6XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbmRlclNlcGFyYXRvcigpO1xuXHRcdFx0Y2FzZSAnZ3JvdXAnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJHcm91cChpdGVtKTtcblx0XHRcdGNhc2UgJ2FsaWduJzpcblx0XHRcdGNhc2UgJ3NpemUnOlxuXHRcdFx0Y2FzZSAnY29sb3InOlxuXHRcdFx0Y2FzZSAnYmFja2dyb3VuZCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbmRlckNob2ljZXMoaXRlbSk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJBY3Rpb24oaXRlbSk7XG5cdFx0fVxuXHR9LFxuXG5cdGdldENsYXNzTmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICdxdWlsbC10b29sYmFyICcgKyAodGhpcy5wcm9wcy5jbGFzc05hbWV8fCcnKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uZGl2KHtcblx0XHRcdGNsYXNzTmFtZTogdGhpcy5nZXRDbGFzc05hbWUoKSB9LFxuXHRcdFx0dGhpcy5wcm9wcy5pdGVtcy5tYXAodGhpcy5yZW5kZXJJdGVtKVxuXHRcdCk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpbGxUb29sYmFyO1xuUXVpbGxUb29sYmFyLmRlZmF1bHRJdGVtcyA9IGRlZmF1bHRJdGVtcztcblF1aWxsVG9vbGJhci5kZWZhdWx0Q29sb3JzID0gZGVmYXVsdENvbG9ycztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3Rvb2xiYXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBRdWlsbCA9IHJlcXVpcmUoJ3F1aWxsJyk7XG5cbnZhciBRdWlsbE1peGluID0ge1xuXG5cdC8qKlxuXHRDcmVhdGVzIGFuIGVkaXRvciBvbiB0aGUgZ2l2ZW4gZWxlbWVudC4gVGhlIGVkaXRvciB3aWxsXG5cdGJlIHBhc3NlZCB0aGUgY29uZmlndXJhdGlvbiwgaGF2ZSBpdHMgZXZlbnRzIGJvdW5kLFxuXHQqL1xuXHRjcmVhdGVFZGl0b3I6IGZ1bmN0aW9uKCRlbCwgY29uZmlnKSB7XG5cdFx0dmFyIGVkaXRvciA9IG5ldyBRdWlsbCgkZWwsIGNvbmZpZyk7XG5cdFx0dGhpcy5ob29rRWRpdG9yKGVkaXRvcik7XG5cdFx0cmV0dXJuIGVkaXRvcjtcblx0fSxcblxuXHRob29rRWRpdG9yOiBmdW5jdGlvbihlZGl0b3IpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0ZWRpdG9yLm9uKCd0ZXh0LWNoYW5nZScsIGZ1bmN0aW9uKGRlbHRhLCBzb3VyY2UpIHtcblx0XHRcdGlmIChzZWxmLm9uRWRpdG9yQ2hhbmdlKSB7XG5cdFx0XHRcdHNlbGYub25FZGl0b3JDaGFuZ2UoZWRpdG9yLmdldEhUTUwoKSwgZGVsdGEsIHNvdXJjZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0dXBkYXRlRWRpdG9yOiBmdW5jdGlvbihlZGl0b3IsIGNvbmZpZykge1xuXHRcdC8vIE5PVEU6IFRoaXMgdGVhcnMgdGhlIGVkaXRvciBkb3duLCBhbmQgcmVpbml0aWFsaXplc1xuXHRcdC8vICAgICAgIGl0IHdpdGggdGhlIG5ldyBjb25maWcuIFVnbHkgYnV0IG5lY2Vzc2FyeVxuXHRcdC8vICAgICAgIGFzIHRoZXJlIGlzIG5vIGFwaSBmb3IgdXBkYXRpbmcgaXQuXG5cdFx0dGhpcy5kZXN0cm95RWRpdG9yKGVkaXRvcik7XG5cdFx0dGhpcy5jcmVhdGVFZGl0b3IoY29uZmlnKTtcblx0XHRyZXR1cm4gZWRpdG9yO1xuXHR9LFxuXG5cdGRlc3Ryb3lFZGl0b3I6IGZ1bmN0aW9uKGVkaXRvcikge1xuXHRcdGVkaXRvci5kZXN0cm95KCk7XG5cdH0sXG5cblx0Lypcblx0UmVwbGFjZSB0aGUgY29udGVudHMgb2YgdGhlIGVkaXRvciwgYnV0IGtlZXBcblx0dGhlIHByZXZpb3VzIHNlbGVjdGlvbiBoYW5naW5nIGFyb3VuZCBzbyB0aGF0XG5cdHRoZSBjdXJzb3Igd29uJ3QgbW92ZS5cblx0Ki9cblx0c2V0RWRpdG9yQ29udGVudHM6IGZ1bmN0aW9uKGVkaXRvciwgdmFsdWUpIHtcblx0XHR2YXIgc2VsID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuXHRcdGVkaXRvci5zZXRIVE1MKHZhbHVlKTtcblx0XHRlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbCk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbE1peGluO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWl4aW4uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInF1aWxsXCIsXCJjb21tb25qczJcIjpcInF1aWxsXCIsXCJhbWRcIjpcInF1aWxsXCIsXCJyb290XCI6XCJRdWlsbFwifVxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=