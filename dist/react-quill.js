(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "quill"], factory);
	else if(typeof exports === 'object')
		exports["ReactQuill"] = factory(require("react"), require("quill"));
	else
		root["ReactQuill"] = factory(root["React"], root["Quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
	module.exports.Mixin = __webpack_require__(/*! ./mixin */ 2);
	module.exports.Toolbar = __webpack_require__(/*! ./toolbar */ 3);


/***/ },
/* 1 */
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 4),
		QuillToolbar = __webpack_require__(/*! ./toolbar */ 3),
		QuillMixin = __webpack_require__(/*! ./mixin */ 2),
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
			toolbar:      T.object,
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
			return this.props.value || this.props.defaultValue;
		},
	
		getClassName: function() {
			return ['quill', this.props.className].join(' ');
		},
	
		/*
		Renders either the specified contents, or a default
		configuration of toolbar and contents area.
		*/
		renderContents: function() {
			if (React.Children.count(this.props.children) > 0) {
				return React.Children.only(this.props.children);
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
/*!**********************!*\
  !*** ./src/mixin.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 4),
		Quill = __webpack_require__(/*! quill */ 5),
		T = React.PropTypes;
	
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
/* 3 */
/*!************************!*\
  !*** ./src/toolbar.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 4),
		T = React.PropTypes;
	
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
			{ type:'link', label:'Link' }
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


/***/ },
/* 4 */
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwNGVkOTgxY2QwY2M0OTQ3MzA4YiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xiYXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVG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O0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBLEVBQUM7O0FBRUQ7Ozs7Ozs7Ozs7QUNoSEEsZ0Q7Ozs7Ozs7OztBQ0FBLGdEIiwiZmlsZSI6Ii4vZGlzdC9yZWFjdC1xdWlsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIiwgXCJxdWlsbFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFF1aWxsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIiksIHJlcXVpcmUoXCJxdWlsbFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVhY3RRdWlsbFwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wiUXVpbGxcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV80X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAwNGVkOTgxY2QwY2M0OTQ3MzA4YlxuICoqLyIsIi8qXHJcblJlYWN0LVF1aWxsIHYwLjAuM1xyXG5odHRwczovL2dpdGh1Yi5jb20vemVub2FtYXJvL3JlYWN0LXF1aWxsXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKTtcclxubW9kdWxlLmV4cG9ydHMuTWl4aW4gPSByZXF1aXJlKCcuL21peGluJyk7XHJcbm1vZHVsZS5leHBvcnRzLlRvb2xiYXIgPSByZXF1aXJlKCcuL3Rvb2xiYXInKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0UXVpbGxUb29sYmFyID0gcmVxdWlyZSgnLi90b29sYmFyJyksXHJcblx0UXVpbGxNaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKSxcclxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xyXG5cclxuLy8gU3VwcG9ydCBSZWFjdCAwLjExIGFuZCAwLjEyXHJcbi8vIEZJWE1FOiBSZW1vdmUgd2l0aCBSZWFjdCAwLjEzXHJcbmlmIChSZWFjdC5jcmVhdGVGYWN0b3J5KSB7XHJcblx0UXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShRdWlsbFRvb2xiYXIpO1xyXG59XHJcblxyXG52YXIgUXVpbGxDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGRpc3BsYXlOYW1lOiAnUXVpbGwnLFxyXG5cclxuXHRtaXhpbnM6IFsgUXVpbGxNaXhpbiBdLFxyXG5cclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdGlkOiAgICAgICAgICAgVC5zdHJpbmcsXHJcblx0XHRjbGFzc05hbWU6ICAgIFQuc3RyaW5nLFxyXG5cdFx0dmFsdWU6ICAgICAgICBULnN0cmluZyxcclxuXHRcdGRlZmF1bHRWYWx1ZTogVC5zdHJpbmcsXHJcblx0XHRyZWFkT25seTogICAgIFQuYm9vbCxcclxuXHRcdHRvb2xiYXI6ICAgICAgVC5vYmplY3QsXHJcblx0XHRmb3JtYXRzOiAgICAgIFQuYXJyYXksXHJcblx0XHRzdHlsZXM6ICAgICAgIFQub2JqZWN0LFxyXG5cdFx0dGhlbWU6ICAgICAgICBULnN0cmluZyxcclxuXHRcdHBvbGxJbnRlcnZhbDogVC5udW1iZXIsXHJcblx0XHRvbkNoYW5nZTogICAgIFQuZnVuY1xyXG5cdH0sXHJcblxyXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRjbGFzc05hbWU6ICcnLFxyXG5cdFx0XHR0aGVtZTogJ2Jhc2UnLFxyXG5cdFx0XHRtb2R1bGVzOiB7fVxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHQvKlxyXG5cdFJldHJpZXZlIHRoZSBpbml0aWFsIHZhbHVlIGZyb20gZWl0aGVyIGB2YWx1ZWAgKHByZWZlcnJlZClcclxuXHRvciBgZGVmYXVsdFZhbHVlYCBpZiB5b3Ugd2FudCBhbiB1bi1jb250cm9sbGVkIGNvbXBvbmVudC5cclxuXHQqL1xyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge307XHJcblx0fSxcclxuXHJcblx0LypcclxuXHRVcGRhdGUgb25seSBpZiB3ZSd2ZSBiZWVuIHBhc3NlZCBhIG5ldyBgdmFsdWVgLlxyXG5cdFRoaXMgbGVhdmVzIGNvbXBvbmVudHMgdXNpbmcgYGRlZmF1bHRWYWx1ZWAgYWxvbmUuXHJcblx0Ki9cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcclxuXHRcdGlmICgndmFsdWUnIGluIG5leHRQcm9wcykge1xyXG5cdFx0XHRpZiAobmV4dFByb3BzLnZhbHVlICE9PSB0aGlzLnByb3BzLnZhbHVlKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRFZGl0b3JDb250ZW50cyh0aGlzLnN0YXRlLmVkaXRvciwgbmV4dFByb3BzLnZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcihcclxuXHRcdFx0dGhpcy5nZXRFZGl0b3JFbGVtZW50KCksXHJcblx0XHRcdHRoaXMuZ2V0RWRpdG9yQ29uZmlnKCkpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGVkaXRvcjplZGl0b3IgfSk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5kZXN0cm95RWRpdG9yKHRoaXMuc3RhdGUuZWRpdG9yKTtcclxuXHRcdC8vIE5PVEU6IERvbid0IHNldCB0aGUgc3RhdGUgdG8gbnVsbCBoZXJlXHJcblx0XHQvLyAgICAgICBhcyBpdCB3b3VsZCBnZW5lcmF0ZSBhIGxvb3AuXHJcblx0fSxcclxuXHJcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xyXG5cdFx0Ly8gTmV2ZXIgcmUtcmVuZGVyIG9yIHdlIGxvc2UgdGhlIGVsZW1lbnQuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0LypcclxuXHRJZiBmb3Igd2hhdGV2ZXIgcmVhc29uIHdlIGFyZSByZW5kZXJpbmcgYWdhaW4sXHJcblx0d2Ugc2hvdWxkIHRlYXIgZG93biB0aGUgZWRpdG9yIGFuZCBicmluZyBpdCB1cFxyXG5cdGFnYWluLlxyXG5cdCovXHJcblx0Y29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcclxuXHR9LFxyXG5cclxuXHRnZXRFZGl0b3JDb25maWc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvbmZpZyA9IHtcclxuXHRcdFx0cmVhZE9ubHk6ICAgICB0aGlzLnByb3BzLnJlYWRPbmx5LFxyXG5cdFx0XHR0aGVtZTogICAgICAgIHRoaXMucHJvcHMudGhlbWUsXHJcblx0XHRcdGZvcm1hdHM6ICAgICAgdGhpcy5wcm9wcy5mb3JtYXRzLFxyXG5cdFx0XHRzdHlsZXM6ICAgICAgIHRoaXMucHJvcHMuc3R5bGVzLFxyXG5cdFx0XHRtb2R1bGVzOiAgICAgIHRoaXMucHJvcHMubW9kdWxlcyxcclxuXHRcdFx0cG9sbEludGVydmFsOiB0aGlzLnByb3BzLnBvbGxJbnRlcnZhbFxyXG5cdFx0fTtcclxuXHRcdC8vIFVubGVzcyB3ZSdyZSByZWRlZmluaW5nIHRoZSB0b29sYmFyLFxyXG5cdFx0Ly8gYXR0YWNoIHRvIHRoZSBkZWZhdWx0IG9uZSBhcyBhIHJlZi5cclxuXHRcdGlmICghY29uZmlnLm1vZHVsZXMudG9vbGJhcikge1xyXG5cdFx0XHQvLyBEb24ndCBtdXRhdGUgdGhlIG9yaWdpbmFsIG1vZHVsZXNcclxuXHRcdFx0Ly8gYmVjYXVzZSBpdCdzIHNoYXJlZCBiZXR3ZWVuIGNvbXBvbmVudHMuXHJcblx0XHRcdGNvbmZpZy5tb2R1bGVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWcubW9kdWxlcykpO1xyXG5cdFx0XHRjb25maWcubW9kdWxlcy50b29sYmFyID0ge1xyXG5cdFx0XHRcdGNvbnRhaW5lcjogdGhpcy5yZWZzLnRvb2xiYXIuZ2V0RE9NTm9kZSgpXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29uZmlnO1xyXG5cdH0sXHJcblxyXG5cdGdldEVkaXRvckVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucmVmcy5lZGl0b3IuZ2V0RE9NTm9kZSgpO1xyXG5cdH0sXHJcblxyXG5cdGdldEVkaXRvckNvbnRlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLnByb3BzLnZhbHVlIHx8IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGdldENsYXNzTmFtZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gWydxdWlsbCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lXS5qb2luKCcgJyk7XHJcblx0fSxcclxuXHJcblx0LypcclxuXHRSZW5kZXJzIGVpdGhlciB0aGUgc3BlY2lmaWVkIGNvbnRlbnRzLCBvciBhIGRlZmF1bHRcclxuXHRjb25maWd1cmF0aW9uIG9mIHRvb2xiYXIgYW5kIGNvbnRlbnRzIGFyZWEuXHJcblx0Ki9cclxuXHRyZW5kZXJDb250ZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoUmVhY3QuQ2hpbGRyZW4uY291bnQodGhpcy5wcm9wcy5jaGlsZHJlbikgPiAwKSB7XHJcblx0XHRcdHJldHVybiBSZWFjdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHRRdWlsbFRvb2xiYXIoe1xyXG5cdFx0XHRcdFx0a2V5Oid0b29sYmFyJyxcclxuXHRcdFx0XHRcdHJlZjondG9vbGJhcicsXHJcblx0XHRcdFx0XHRpdGVtczogdGhpcy5wcm9wcy50b29sYmFyXHJcblx0XHRcdFx0fSksXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7XHJcblx0XHRcdFx0XHRrZXk6J2VkaXRvcicsXHJcblx0XHRcdFx0XHRyZWY6J2VkaXRvcicsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdxdWlsbC1jb250ZW50cycsXHJcblx0XHRcdFx0XHRkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6dGhpcy5nZXRFZGl0b3JDb250ZW50cygpIH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmRpdih7XHJcblx0XHRcdGNsYXNzTmFtZTogdGhpcy5nZXRDbGFzc05hbWUoKSxcclxuXHRcdFx0b25DaGFuZ2U6IHRoaXMucHJldmVudERlZmF1bHQgfSxcclxuXHRcdFx0dGhpcy5yZW5kZXJDb250ZW50cygpXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdC8qXHJcblx0VXBkYXRlcyB0aGUgbG9jYWwgc3RhdGUgd2l0aCB0aGUgbmV3IGNvbnRlbnRzLFxyXG5cdGV4ZWN1dGVzIHRoZSBjaGFuZ2UgaGFuZGxlciBwYXNzZWQgYXMgcHJvcHMuXHJcblx0Ki9cclxuXHRvbkVkaXRvckNoYW5nZTogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xyXG5cdFx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UodmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LypcclxuXHRTdG9wIGNoYW5nZSBldmVudHMgZnJvbSB0aGUgdG9vbGJhciBmcm9tXHJcblx0YnViYmxpbmcgdXAgb3V0c2lkZS5cclxuXHQqL1xyXG5cdHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbENvbXBvbmVudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0UXVpbGwgPSByZXF1aXJlKCdxdWlsbCcpLFxyXG5cdFQgPSBSZWFjdC5Qcm9wVHlwZXM7XHJcblxyXG52YXIgUXVpbGxNaXhpbiA9IHtcclxuXHJcblx0LyoqXHJcblx0Q3JlYXRlcyBhbiBlZGl0b3Igb24gdGhlIGdpdmVuIGVsZW1lbnQuIFRoZSBlZGl0b3Igd2lsbFxyXG5cdGJlIHBhc3NlZCB0aGUgY29uZmlndXJhdGlvbiwgaGF2ZSBpdHMgZXZlbnRzIGJvdW5kLFxyXG5cdCovXHJcblx0Y3JlYXRlRWRpdG9yOiBmdW5jdGlvbigkZWwsIGNvbmZpZykge1xyXG5cdFx0dmFyIGVkaXRvciA9IG5ldyBRdWlsbCgkZWwsIGNvbmZpZyk7XHJcblx0XHR0aGlzLmhvb2tFZGl0b3IoZWRpdG9yKTtcclxuXHRcdHJldHVybiBlZGl0b3I7XHJcblx0fSxcclxuXHJcblx0aG9va0VkaXRvcjogZnVuY3Rpb24oZWRpdG9yKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRlZGl0b3Iub24oJ3RleHQtY2hhbmdlJywgZnVuY3Rpb24oZGVsdGEsIHNvdXJjZSkge1xyXG5cdFx0XHRpZiAoc2VsZi5vbkVkaXRvckNoYW5nZSkge1xyXG5cdFx0XHRcdHNlbGYub25FZGl0b3JDaGFuZ2UoZWRpdG9yLmdldEhUTUwoKSwgZGVsdGEsIHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZUVkaXRvcjogZnVuY3Rpb24oZWRpdG9yLCBjb25maWcpIHtcclxuXHRcdC8vIE5PVEU6IFRoaXMgdGVhcnMgdGhlIGVkaXRvciBkb3duLCBhbmQgcmVpbml0aWFsaXplc1xyXG5cdFx0Ly8gICAgICAgaXQgd2l0aCB0aGUgbmV3IGNvbmZpZy4gVWdseSBidXQgbmVjZXNzYXJ5XHJcblx0XHQvLyAgICAgICBhcyB0aGVyZSBpcyBubyBhcGkgZm9yIHVwZGF0aW5nIGl0LlxyXG5cdFx0dGhpcy5kZXN0cm95RWRpdG9yKGVkaXRvcik7XHJcblx0XHR0aGlzLmNyZWF0ZUVkaXRvcihjb25maWcpO1xyXG5cdFx0cmV0dXJuIGVkaXRvcjtcclxuXHR9LFxyXG5cclxuXHRkZXN0cm95RWRpdG9yOiBmdW5jdGlvbihlZGl0b3IpIHtcclxuXHRcdGVkaXRvci5kZXN0cm95KCk7XHJcblx0fSxcclxuXHJcblx0LypcclxuXHRSZXBsYWNlIHRoZSBjb250ZW50cyBvZiB0aGUgZWRpdG9yLCBidXQga2VlcFxyXG5cdHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gaGFuZ2luZyBhcm91bmQgc28gdGhhdFxyXG5cdHRoZSBjdXJzb3Igd29uJ3QgbW92ZS5cclxuXHQqL1xyXG5cdHNldEVkaXRvckNvbnRlbnRzOiBmdW5jdGlvbihlZGl0b3IsIHZhbHVlKSB7XHJcblx0XHR2YXIgc2VsID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xyXG5cdFx0ZWRpdG9yLnNldEhUTUwodmFsdWUpO1xyXG5cdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWwpO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWxsTWl4aW47XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9taXhpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0VCA9IFJlYWN0LlByb3BUeXBlcztcclxuXHJcbnZhciBkZWZhdWx0SXRlbXMgPSBbXHJcblxyXG5cdHsgbGFiZWw6J0Zvcm1hdHMnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXHJcblx0XHR7IGxhYmVsOidTaXplJywgdHlwZTonc2l6ZScsIGl0ZW1zOiBbXHJcblx0XHRcdHsgbGFiZWw6J05vcm1hbCcsIHZhbHVlOicnIH0sXHJcblx0XHRcdHsgbGFiZWw6J1NtYWxsZXInLCB2YWx1ZTonMC44ZW0nIH0sXHJcblx0XHRcdHsgbGFiZWw6J0xhcmdlcicsIHZhbHVlOicxLjRlbScgfSxcclxuXHRcdFx0eyBsYWJlbDonSHVnZScsIHZhbHVlOicyZW0nIH1cclxuXHRcdF19LFxyXG5cdFx0eyBsYWJlbDonQWxpZ25tZW50JywgdHlwZTonYWxpZ24nLCBpdGVtczogW1xyXG5cdFx0XHR7IGxhYmVsOidDZW50ZXInLCB2YWx1ZTonY2VudGVyJyB9LFxyXG5cdFx0XHR7IGxhYmVsOidMZWZ0JywgdmFsdWU6J2xlZnQnIH0sXHJcblx0XHRcdHsgbGFiZWw6J1JpZ2h0JywgdmFsdWU6J3JpZ2h0JyB9LFxyXG5cdFx0XHR7IGxhYmVsOidKdXN0aWZ5JywgdmFsdWU6J2p1c3RpZnknIH1cclxuXHRcdF19XHJcblx0XX0sXHJcblxyXG5cdHsgbGFiZWw6J1RleHQnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXHJcblx0XHR7IHR5cGU6J2JvbGQnLCBsYWJlbDonQm9sZCcgfSxcclxuXHRcdHsgdHlwZTonaXRhbGljJywgbGFiZWw6J0l0YWxpYycgfSxcclxuXHRcdHsgdHlwZTonc3RyaWtlJywgbGFiZWw6J1N0cmlrZScgfSxcclxuXHRcdHsgdHlwZTondW5kZXJsaW5lJywgbGFiZWw6J1VuZGVybGluZScgfSxcclxuXHRcdHsgdHlwZTonbGluaycsIGxhYmVsOidMaW5rJyB9XHJcblx0XX0sXHJcblxyXG5cdHsgbGFiZWw6J0Jsb2NrcycsIHR5cGU6J2dyb3VwJywgaXRlbXM6IFtcclxuXHRcdHsgdHlwZTonYnVsbGV0JywgbGFiZWw6J0J1bGxldCcgfSxcclxuXHRcdHsgdHlwZTonbGlzdCcsIGxhYmVsOidMaXN0JyB9XHJcblx0XX1cclxuXHJcbl07XHJcblxyXG52YXIgUXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRkaXNwbGF5TmFtZTogJ1F1aWxsIFRvb2xiYXInLFxyXG5cclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdGlkOiAgICAgICAgVC5zdHJpbmcsXHJcblx0XHRjbGFzc05hbWU6IFQuc3RyaW5nLFxyXG5cdFx0aXRlbXM6ICAgICBULmFycmF5XHJcblx0fSxcclxuXHJcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXRlbXM6IGRlZmF1bHRJdGVtc1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXJHcm91cDogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zcGFuKHtcclxuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxyXG5cdFx0XHRjbGFzc05hbWU6J3FsLWZvcm1hdC1ncm91cCcgfSxcclxuXHRcdFx0aXRlbS5pdGVtcy5tYXAodGhpcy5yZW5kZXJJdGVtKVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXJDaG9pY2VJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRyZXR1cm4gUmVhY3QuRE9NLm9wdGlvbih7XHJcblx0XHRcdGtleTogaXRlbS5sYWJlbCB8fCBpdGVtLnZhbHVlLFxyXG5cdFx0XHR2YWx1ZTppdGVtLnZhbHVlIH0sXHJcblx0XHRcdGl0ZW0ubGFiZWxcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyQ2hvaWNlczogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zZWxlY3Qoe1xyXG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwsXHJcblx0XHRcdGNsYXNzTmFtZTogJ3FsLScraXRlbS50eXBlIH0sXHJcblx0XHRcdGl0ZW0uaXRlbXMubWFwKHRoaXMucmVuZGVyQ2hvaWNlSXRlbSlcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyQWN0aW9uOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe1xyXG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YWx1ZSxcclxuXHRcdFx0Y2xhc3NOYW1lOiAncWwtZm9ybWF0LWJ1dHRvbiBxbC0nK2l0ZW0udHlwZSxcclxuXHRcdFx0dGl0bGU6IGl0ZW0ubGFiZWwgfVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXJJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG5cdFx0XHRjYXNlICdncm91cCc6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyR3JvdXAoaXRlbSk7XHJcblx0XHRcdGNhc2UgJ2FsaWduJzpcclxuXHRcdFx0Y2FzZSAnc2l6ZSc6XHJcblx0XHRcdGNhc2UgJ2NvbG9yJzpcclxuXHRcdFx0Y2FzZSAnYmFja2dyb3VuZCc6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyQ2hvaWNlcyhpdGVtKTtcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJBY3Rpb24oaXRlbSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Z2V0Q2xhc3NOYW1lOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAncXVpbGwtdG9vbGJhciAnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lfHwnJyk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBSZWFjdC5ET00uZGl2KHtcclxuXHRcdFx0Y2xhc3NOYW1lOiB0aGlzLmdldENsYXNzTmFtZSgpIH0sXHJcblx0XHRcdHRoaXMucHJvcHMuaXRlbXMubWFwKHRoaXMucmVuZGVySXRlbSlcclxuXHRcdCk7XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWxsVG9vbGJhcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90b29sYmFyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInF1aWxsXCIsXCJjb21tb25qczJcIjpcInF1aWxsXCIsXCJhbWRcIjpcInF1aWxsXCIsXCJyb290XCI6XCJRdWlsbFwifVxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=