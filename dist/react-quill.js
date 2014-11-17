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
	React-Quill 0.0.2
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
			var mapping = {
				'group': this.renderGroup,
				'align': this.renderChoices,
				'size': this.renderChoices,
				'action': this.renderAction
			};
			var renderer = mapping[item.type] || mapping.action;
			return renderer(item);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkNjBkMWRlNjNkNjY1NzdjODg4MiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xiYXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztB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Q0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBLEVBQUM7O0FBRUQsK0I7Ozs7Ozs7OztBQzdHQSxnRDs7Ozs7Ozs7O0FDQUEsZ0QiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJyZWFjdFwiKSwgcmVxdWlyZShcInF1aWxsXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInJlYWN0XCIsIFwicXVpbGxcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiUmVhY3RRdWlsbFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlJlYWN0UXVpbGxcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSwgcm9vdFtcIlF1aWxsXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzVfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGQ2MGQxZGU2M2Q2NjU3N2M4ODgyXG4gKiovIiwiLypcblJlYWN0LVF1aWxsIDAuMC4yXG5odHRwczovL2dpdGh1Yi5jb20vemVub2FtYXJvL3JlYWN0LXF1aWxsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpO1xubW9kdWxlLmV4cG9ydHMuTWl4aW4gPSByZXF1aXJlKCcuL21peGluJyk7XG5tb2R1bGUuZXhwb3J0cy5Ub29sYmFyID0gcmVxdWlyZSgnLi90b29sYmFyJyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRRdWlsbFRvb2xiYXIgPSByZXF1aXJlKCcuL3Rvb2xiYXInKSxcblx0UXVpbGxNaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKSxcblx0VCA9IFJlYWN0LlByb3BUeXBlcztcblxuLy8gU3VwcG9ydCBSZWFjdCAwLjExIGFuZCAwLjEyXG4vLyBGSVhNRTogUmVtb3ZlIHdpdGggUmVhY3QgMC4xM1xuaWYgKFJlYWN0LmNyZWF0ZUZhY3RvcnkpIHtcblx0UXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShRdWlsbFRvb2xiYXIpO1xufVxuXG52YXIgUXVpbGxDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdRdWlsbCcsXG5cblx0bWl4aW5zOiBbIFF1aWxsTWl4aW4gXSxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRpZDogICAgICAgICAgIFQuc3RyaW5nLFxuXHRcdGNsYXNzTmFtZTogICAgVC5zdHJpbmcsXG5cdFx0dmFsdWU6ICAgICAgICBULnN0cmluZyxcblx0XHRkZWZhdWx0VmFsdWU6IFQuc3RyaW5nLFxuXHRcdHJlYWRPbmx5OiAgICAgVC5ib29sLFxuXHRcdHRvb2xiYXI6ICAgICAgVC5vYmplY3QsXG5cdFx0Zm9ybWF0czogICAgICBULmFycmF5LFxuXHRcdHN0eWxlczogICAgICAgVC5vYmplY3QsXG5cdFx0dGhlbWU6ICAgICAgICBULnN0cmluZyxcblx0XHRwb2xsSW50ZXJ2YWw6IFQubnVtYmVyLFxuXHRcdG9uQ2hhbmdlOiAgICAgVC5mdW5jXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2xhc3NOYW1lOiAnJyxcblx0XHRcdHRoZW1lOiAnYmFzZScsXG5cdFx0XHRtb2R1bGVzOiB7fVxuXHRcdH07XG5cdH0sXG5cblx0Lypcblx0UmV0cmlldmUgdGhlIGluaXRpYWwgdmFsdWUgZnJvbSBlaXRoZXIgYHZhbHVlYCAocHJlZmVycmVkKVxuXHRvciBgZGVmYXVsdFZhbHVlYCBpZiB5b3Ugd2FudCBhbiB1bi1jb250cm9sbGVkIGNvbXBvbmVudC5cblx0Ki9cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge307XG5cdH0sXG5cblx0Lypcblx0VXBkYXRlIG9ubHkgaWYgd2UndmUgYmVlbiBwYXNzZWQgYSBuZXcgYHZhbHVlYC5cblx0VGhpcyBsZWF2ZXMgY29tcG9uZW50cyB1c2luZyBgZGVmYXVsdFZhbHVlYCBhbG9uZS5cblx0Ki9cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG5cdFx0aWYgKCd2YWx1ZScgaW4gbmV4dFByb3BzKSB7XG5cdFx0XHRpZiAobmV4dFByb3BzLnZhbHVlICE9PSB0aGlzLnByb3BzLnZhbHVlKSB7XG5cdFx0XHRcdHRoaXMuc2V0RWRpdG9yQ29udGVudHModGhpcy5zdGF0ZS5lZGl0b3IsIG5leHRQcm9wcy52YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZWRpdG9yID0gdGhpcy5jcmVhdGVFZGl0b3IoXG5cdFx0XHR0aGlzLmdldEVkaXRvckVsZW1lbnQoKSxcblx0XHRcdHRoaXMuZ2V0RWRpdG9yQ29uZmlnKCkpO1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBlZGl0b3I6ZWRpdG9yIH0pO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmRlc3Ryb3lFZGl0b3IodGhpcy5zdGF0ZS5lZGl0b3IpO1xuXHRcdC8vIE5PVEU6IERvbid0IHNldCB0aGUgc3RhdGUgdG8gbnVsbCBoZXJlXG5cdFx0Ly8gICAgICAgYXMgaXQgd291bGQgZ2VuZXJhdGUgYSBsb29wLlxuXHR9LFxuXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZTogZnVuY3Rpb24obmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcblx0XHQvLyBOZXZlciByZS1yZW5kZXIgb3Igd2UgbG9zZSB0aGUgZWxlbWVudC5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0Lypcblx0SWYgZm9yIHdoYXRldmVyIHJlYXNvbiB3ZSBhcmUgcmVuZGVyaW5nIGFnYWluLFxuXHR3ZSBzaG91bGQgdGVhciBkb3duIHRoZSBlZGl0b3IgYW5kIGJyaW5nIGl0IHVwXG5cdGFnYWluLlxuXHQqL1xuXHRjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XG5cdH0sXG5cblx0Z2V0RWRpdG9yQ29uZmlnOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29uZmlnID0ge1xuXHRcdFx0cmVhZE9ubHk6ICAgICB0aGlzLnByb3BzLnJlYWRPbmx5LFxuXHRcdFx0dGhlbWU6ICAgICAgICB0aGlzLnByb3BzLnRoZW1lLFxuXHRcdFx0Zm9ybWF0czogICAgICB0aGlzLnByb3BzLmZvcm1hdHMsXG5cdFx0XHRzdHlsZXM6ICAgICAgIHRoaXMucHJvcHMuc3R5bGVzLFxuXHRcdFx0bW9kdWxlczogICAgICB0aGlzLnByb3BzLm1vZHVsZXMsXG5cdFx0XHRwb2xsSW50ZXJ2YWw6IHRoaXMucHJvcHMucG9sbEludGVydmFsXG5cdFx0fTtcblx0XHQvLyBVbmxlc3Mgd2UncmUgcmVkZWZpbmluZyB0aGUgdG9vbGJhcixcblx0XHQvLyBhdHRhY2ggdG8gdGhlIGRlZmF1bHQgb25lIGFzIGEgcmVmLlxuXHRcdGlmICghY29uZmlnLm1vZHVsZXMudG9vbGJhcikge1xuXHRcdFx0Ly8gRG9uJ3QgbXV0YXRlIHRoZSBvcmlnaW5hbCBtb2R1bGVzXG5cdFx0XHQvLyBiZWNhdXNlIGl0J3Mgc2hhcmVkIGJldHdlZW4gY29tcG9uZW50cy5cblx0XHRcdGNvbmZpZy5tb2R1bGVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWcubW9kdWxlcykpO1xuXHRcdFx0Y29uZmlnLm1vZHVsZXMudG9vbGJhciA9IHtcblx0XHRcdFx0Y29udGFpbmVyOiB0aGlzLnJlZnMudG9vbGJhci5nZXRET01Ob2RlKClcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBjb25maWc7XG5cdH0sXG5cblx0Z2V0RWRpdG9yRWxlbWVudDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVmcy5lZGl0b3IuZ2V0RE9NTm9kZSgpO1xuXHR9LFxuXG5cdGdldEVkaXRvckNvbnRlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy52YWx1ZSB8fCB0aGlzLnByb3BzLmRlZmF1bHRWYWx1ZTtcblx0fSxcblxuXHRnZXRDbGFzc05hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBbJ3F1aWxsJywgdGhpcy5wcm9wcy5jbGFzc05hbWVdLmpvaW4oJyAnKTtcblx0fSxcblxuXHQvKlxuXHRSZW5kZXJzIGVpdGhlciB0aGUgc3BlY2lmaWVkIGNvbnRlbnRzLCBvciBhIGRlZmF1bHRcblx0Y29uZmlndXJhdGlvbiBvZiB0b29sYmFyIGFuZCBjb250ZW50cyBhcmVhLlxuXHQqL1xuXHRyZW5kZXJDb250ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKFJlYWN0LkNoaWxkcmVuLmNvdW50KHRoaXMucHJvcHMuY2hpbGRyZW4pID4gMCkge1xuXHRcdFx0cmV0dXJuIFJlYWN0LkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFF1aWxsVG9vbGJhcih7XG5cdFx0XHRcdFx0a2V5Oid0b29sYmFyJyxcblx0XHRcdFx0XHRyZWY6J3Rvb2xiYXInLFxuXHRcdFx0XHRcdGl0ZW1zOiB0aGlzLnByb3BzLnRvb2xiYXJcblx0XHRcdFx0fSksXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe1xuXHRcdFx0XHRcdGtleTonZWRpdG9yJyxcblx0XHRcdFx0XHRyZWY6J2VkaXRvcicsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiAncXVpbGwtY29udGVudHMnLFxuXHRcdFx0XHRcdGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDp0aGlzLmdldEVkaXRvckNvbnRlbnRzKCkgfVxuXHRcdFx0XHR9KVxuXHRcdFx0XTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmRpdih7XG5cdFx0XHRjbGFzc05hbWU6IHRoaXMuZ2V0Q2xhc3NOYW1lKCksXG5cdFx0XHRvbkNoYW5nZTogdGhpcy5wcmV2ZW50RGVmYXVsdCB9LFxuXHRcdFx0dGhpcy5yZW5kZXJDb250ZW50cygpXG5cdFx0KTtcblx0fSxcblxuXHQvKlxuXHRVcGRhdGVzIHRoZSBsb2NhbCBzdGF0ZSB3aXRoIHRoZSBuZXcgY29udGVudHMsXG5cdGV4ZWN1dGVzIHRoZSBjaGFuZ2UgaGFuZGxlciBwYXNzZWQgYXMgcHJvcHMuXG5cdCovXG5cdG9uRWRpdG9yQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qXG5cdFN0b3AgY2hhbmdlIGV2ZW50cyBmcm9tIHRoZSB0b29sYmFyIGZyb21cblx0YnViYmxpbmcgdXAgb3V0c2lkZS5cblx0Ki9cblx0cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbENvbXBvbmVudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0UXVpbGwgPSByZXF1aXJlKCdxdWlsbCcpLFxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xuXG52YXIgUXVpbGxNaXhpbiA9IHtcblxuXHQvKipcblx0Q3JlYXRlcyBhbiBlZGl0b3Igb24gdGhlIGdpdmVuIGVsZW1lbnQuIFRoZSBlZGl0b3Igd2lsbFxuXHRiZSBwYXNzZWQgdGhlIGNvbmZpZ3VyYXRpb24sIGhhdmUgaXRzIGV2ZW50cyBib3VuZCxcblx0Ki9cblx0Y3JlYXRlRWRpdG9yOiBmdW5jdGlvbigkZWwsIGNvbmZpZykge1xuXHRcdHZhciBlZGl0b3IgPSBuZXcgUXVpbGwoJGVsLCBjb25maWcpO1xuXHRcdHRoaXMuaG9va0VkaXRvcihlZGl0b3IpO1xuXHRcdHJldHVybiBlZGl0b3I7XG5cdH0sXG5cblx0aG9va0VkaXRvcjogZnVuY3Rpb24oZWRpdG9yKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdGVkaXRvci5vbigndGV4dC1jaGFuZ2UnLCBmdW5jdGlvbihkZWx0YSwgc291cmNlKSB7XG5cdFx0XHRpZiAoc2VsZi5vbkVkaXRvckNoYW5nZSkge1xuXHRcdFx0XHRzZWxmLm9uRWRpdG9yQ2hhbmdlKGVkaXRvci5nZXRIVE1MKCksIGRlbHRhLCBzb3VyY2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdHVwZGF0ZUVkaXRvcjogZnVuY3Rpb24oZWRpdG9yLCBjb25maWcpIHtcblx0XHQvLyBOT1RFOiBUaGlzIHRlYXJzIHRoZSBlZGl0b3IgZG93biwgYW5kIHJlaW5pdGlhbGl6ZXNcblx0XHQvLyAgICAgICBpdCB3aXRoIHRoZSBuZXcgY29uZmlnLiBVZ2x5IGJ1dCBuZWNlc3Nhcnlcblx0XHQvLyAgICAgICBhcyB0aGVyZSBpcyBubyBhcGkgZm9yIHVwZGF0aW5nIGl0LlxuXHRcdHRoaXMuZGVzdHJveUVkaXRvcihlZGl0b3IpO1xuXHRcdHRoaXMuY3JlYXRlRWRpdG9yKGNvbmZpZyk7XG5cdFx0cmV0dXJuIGVkaXRvcjtcblx0fSxcblxuXHRkZXN0cm95RWRpdG9yOiBmdW5jdGlvbihlZGl0b3IpIHtcblx0XHRlZGl0b3IuZGVzdHJveSgpO1xuXHR9LFxuXG5cdC8qXG5cdFJlcGxhY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBlZGl0b3IsIGJ1dCBrZWVwXG5cdHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gaGFuZ2luZyBhcm91bmQgc28gdGhhdFxuXHR0aGUgY3Vyc29yIHdvbid0IG1vdmUuXG5cdCovXG5cdHNldEVkaXRvckNvbnRlbnRzOiBmdW5jdGlvbihlZGl0b3IsIHZhbHVlKSB7XG5cdFx0dmFyIHNlbCA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcblx0XHRlZGl0b3Iuc2V0SFRNTCh2YWx1ZSk7XG5cdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWwpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpbGxNaXhpbjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21peGluLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xuXG52YXIgZGVmYXVsdEl0ZW1zID0gW1xuXG5cdHsgbGFiZWw6J0Zvcm1hdHMnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyBsYWJlbDonU2l6ZScsIHR5cGU6J3NpemUnLCBpdGVtczogW1xuXHRcdFx0eyBsYWJlbDonTm9ybWFsJywgdmFsdWU6JycgfSxcblx0XHRcdHsgbGFiZWw6J1NtYWxsZXInLCB2YWx1ZTonMC44ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidMYXJnZXInLCB2YWx1ZTonMS40ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidIdWdlJywgdmFsdWU6JzJlbScgfVxuXHRcdF19LFxuXHRcdHsgbGFiZWw6J0FsaWdubWVudCcsIHR5cGU6J2FsaWduJywgaXRlbXM6IFtcblx0XHRcdHsgbGFiZWw6J0NlbnRlcicsIHZhbHVlOidjZW50ZXInIH0sXG5cdFx0XHR7IGxhYmVsOidMZWZ0JywgdmFsdWU6J2xlZnQnIH0sXG5cdFx0XHR7IGxhYmVsOidSaWdodCcsIHZhbHVlOidyaWdodCcgfSxcblx0XHRcdHsgbGFiZWw6J0p1c3RpZnknLCB2YWx1ZTonanVzdGlmeScgfVxuXHRcdF19XG5cdF19LFxuXG5cdHsgbGFiZWw6J1RleHQnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyB0eXBlOidib2xkJywgbGFiZWw6J0JvbGQnIH0sXG5cdFx0eyB0eXBlOidpdGFsaWMnLCBsYWJlbDonSXRhbGljJyB9LFxuXHRcdHsgdHlwZTonc3RyaWtlJywgbGFiZWw6J1N0cmlrZScgfSxcblx0XHR7IHR5cGU6J3VuZGVybGluZScsIGxhYmVsOidVbmRlcmxpbmUnIH0sXG5cdFx0eyB0eXBlOidsaW5rJywgbGFiZWw6J0xpbmsnIH1cblx0XX0sXG5cblx0eyBsYWJlbDonQmxvY2tzJywgdHlwZTonZ3JvdXAnLCBpdGVtczogW1xuXHRcdHsgdHlwZTonYnVsbGV0JywgbGFiZWw6J0J1bGxldCcgfSxcblx0XHR7IHR5cGU6J2xpc3QnLCBsYWJlbDonTGlzdCcgfVxuXHRdfVxuXG5dO1xuXG52YXIgUXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGRpc3BsYXlOYW1lOiAnUXVpbGwgVG9vbGJhcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aWQ6ICAgICAgICBULnN0cmluZyxcblx0XHRjbGFzc05hbWU6IFQuc3RyaW5nLFxuXHRcdGl0ZW1zOiAgICAgVC5hcnJheVxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXRlbXM6IGRlZmF1bHRJdGVtc1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyR3JvdXA6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOidxbC1mb3JtYXQtZ3JvdXAnIH0sXG5cdFx0XHRpdGVtLml0ZW1zLm1hcCh0aGlzLnJlbmRlckl0ZW0pXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5vcHRpb24oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsIHx8IGl0ZW0udmFsdWUsXG5cdFx0XHR2YWx1ZTppdGVtLnZhbHVlIH0sXG5cdFx0XHRpdGVtLmxhYmVsXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VzOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zZWxlY3Qoe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOiAncWwtJytpdGVtLnR5cGUgfSxcblx0XHRcdGl0ZW0uaXRlbXMubWFwKHRoaXMucmVuZGVyQ2hvaWNlSXRlbSlcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckFjdGlvbjogZnVuY3Rpb24oaXRlbSkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YWx1ZSxcblx0XHRcdGNsYXNzTmFtZTogJ3FsLWZvcm1hdC1idXR0b24gcWwtJytpdGVtLnR5cGUsXG5cdFx0XHR0aXRsZTogaXRlbS5sYWJlbCB9XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0dmFyIG1hcHBpbmcgPSB7XG5cdFx0XHQnZ3JvdXAnOiB0aGlzLnJlbmRlckdyb3VwLFxuXHRcdFx0J2FsaWduJzogdGhpcy5yZW5kZXJDaG9pY2VzLFxuXHRcdFx0J3NpemUnOiB0aGlzLnJlbmRlckNob2ljZXMsXG5cdFx0XHQnYWN0aW9uJzogdGhpcy5yZW5kZXJBY3Rpb25cblx0XHR9O1xuXHRcdHZhciByZW5kZXJlciA9IG1hcHBpbmdbaXRlbS50eXBlXSB8fCBtYXBwaW5nLmFjdGlvbjtcblx0XHRyZXR1cm4gcmVuZGVyZXIoaXRlbSk7XG5cdH0sXG5cblx0Z2V0Q2xhc3NOYW1lOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJ3F1aWxsLXRvb2xiYXIgJyArICh0aGlzLnByb3BzLmNsYXNzTmFtZXx8JycpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5kaXYoe1xuXHRcdFx0Y2xhc3NOYW1lOiB0aGlzLmdldENsYXNzTmFtZSgpIH0sXG5cdFx0XHR0aGlzLnByb3BzLml0ZW1zLm1hcCh0aGlzLnJlbmRlckl0ZW0pXG5cdFx0KTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbFRvb2xiYXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90b29sYmFyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInF1aWxsXCIsXCJjb21tb25qczJcIjpcInF1aWxsXCIsXCJhbWRcIjpcInF1aWxsXCIsXCJyb290XCI6XCJRdWlsbFwifVxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6Ii4vZGlzdC9yZWFjdC1xdWlsbC5qcyJ9