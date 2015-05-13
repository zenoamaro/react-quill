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
				case 'font':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3MjQwNmMxMmNmZGZmOWY3NzlhNSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInJlYWN0XCIsXCJjb21tb25qczJcIjpcInJlYWN0XCIsXCJhbWRcIjpcInJlYWN0XCIsXCJyb290XCI6XCJSZWFjdFwifSIsIndlYnBhY2s6Ly8vLi9zcmMvdG9vbGJhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVG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QUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCxHQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSw2Qjs7Ozs7Ozs7O0FDbkRBLGdEIiwiZmlsZSI6Ii4vZGlzdC9yZWFjdC1xdWlsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIiwgXCJxdWlsbFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFF1aWxsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIiksIHJlcXVpcmUoXCJxdWlsbFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVhY3RRdWlsbFwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wiUXVpbGxcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3MjQwNmMxMmNmZGZmOWY3NzlhNVxuICoqLyIsIi8qXG5SZWFjdC1RdWlsbCB2MC4wLjNcbmh0dHBzOi8vZ2l0aHViLmNvbS96ZW5vYW1hcm8vcmVhY3QtcXVpbGxcbiovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50Jyk7XG5tb2R1bGUuZXhwb3J0cy5NaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKTtcbm1vZHVsZS5leHBvcnRzLlRvb2xiYXIgPSByZXF1aXJlKCcuL3Rvb2xiYXInKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFF1aWxsVG9vbGJhciA9IHJlcXVpcmUoJy4vdG9vbGJhcicpLFxuXHRRdWlsbE1peGluID0gcmVxdWlyZSgnLi9taXhpbicpLFxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xuXG4vLyBTdXBwb3J0IFJlYWN0IDAuMTEgYW5kIDAuMTJcbi8vIEZJWE1FOiBSZW1vdmUgd2l0aCBSZWFjdCAwLjEzXG5pZiAoUmVhY3QuY3JlYXRlRmFjdG9yeSkge1xuXHRRdWlsbFRvb2xiYXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFF1aWxsVG9vbGJhcik7XG59XG5cbnZhciBRdWlsbENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1F1aWxsJyxcblxuXHRtaXhpbnM6IFsgUXVpbGxNaXhpbiBdLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGlkOiAgICAgICAgICAgVC5zdHJpbmcsXG5cdFx0Y2xhc3NOYW1lOiAgICBULnN0cmluZyxcblx0XHR2YWx1ZTogICAgICAgIFQuc3RyaW5nLFxuXHRcdGRlZmF1bHRWYWx1ZTogVC5zdHJpbmcsXG5cdFx0cmVhZE9ubHk6ICAgICBULmJvb2wsXG5cdFx0dG9vbGJhcjogICAgICBULmFycmF5LFxuXHRcdGZvcm1hdHM6ICAgICAgVC5hcnJheSxcblx0XHRzdHlsZXM6ICAgICAgIFQub2JqZWN0LFxuXHRcdHRoZW1lOiAgICAgICAgVC5zdHJpbmcsXG5cdFx0cG9sbEludGVydmFsOiBULm51bWJlcixcblx0XHRvbkNoYW5nZTogICAgIFQuZnVuY1xuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNsYXNzTmFtZTogJycsXG5cdFx0XHR0aGVtZTogJ2Jhc2UnLFxuXHRcdFx0bW9kdWxlczoge31cblx0XHR9O1xuXHR9LFxuXG5cdC8qXG5cdFJldHJpZXZlIHRoZSBpbml0aWFsIHZhbHVlIGZyb20gZWl0aGVyIGB2YWx1ZWAgKHByZWZlcnJlZClcblx0b3IgYGRlZmF1bHRWYWx1ZWAgaWYgeW91IHdhbnQgYW4gdW4tY29udHJvbGxlZCBjb21wb25lbnQuXG5cdCovXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9LFxuXG5cdC8qXG5cdFVwZGF0ZSBvbmx5IGlmIHdlJ3ZlIGJlZW4gcGFzc2VkIGEgbmV3IGB2YWx1ZWAuXG5cdFRoaXMgbGVhdmVzIGNvbXBvbmVudHMgdXNpbmcgYGRlZmF1bHRWYWx1ZWAgYWxvbmUuXG5cdCovXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdGlmICgndmFsdWUnIGluIG5leHRQcm9wcykge1xuXHRcdFx0aWYgKG5leHRQcm9wcy52YWx1ZSAhPT0gdGhpcy5wcm9wcy52YWx1ZSkge1xuXHRcdFx0XHR0aGlzLnNldEVkaXRvckNvbnRlbnRzKHRoaXMuc3RhdGUuZWRpdG9yLCBuZXh0UHJvcHMudmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGVkaXRvciA9IHRoaXMuY3JlYXRlRWRpdG9yKFxuXHRcdFx0dGhpcy5nZXRFZGl0b3JFbGVtZW50KCksXG5cdFx0XHR0aGlzLmdldEVkaXRvckNvbmZpZygpKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgZWRpdG9yOmVkaXRvciB9KTtcblx0fSxcblxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5kZXN0cm95RWRpdG9yKHRoaXMuc3RhdGUuZWRpdG9yKTtcblx0XHQvLyBOT1RFOiBEb24ndCBzZXQgdGhlIHN0YXRlIHRvIG51bGwgaGVyZVxuXHRcdC8vICAgICAgIGFzIGl0IHdvdWxkIGdlbmVyYXRlIGEgbG9vcC5cblx0fSxcblxuXHRzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG5cdFx0Ly8gTmV2ZXIgcmUtcmVuZGVyIG9yIHdlIGxvc2UgdGhlIGVsZW1lbnQuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cdC8qXG5cdElmIGZvciB3aGF0ZXZlciByZWFzb24gd2UgYXJlIHJlbmRlcmluZyBhZ2Fpbixcblx0d2Ugc2hvdWxkIHRlYXIgZG93biB0aGUgZWRpdG9yIGFuZCBicmluZyBpdCB1cFxuXHRhZ2Fpbi5cblx0Ki9cblx0Y29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5jb21wb25lbnREaWRNb3VudCgpO1xuXHR9LFxuXG5cdGdldEVkaXRvckNvbmZpZzogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbmZpZyA9IHtcblx0XHRcdHJlYWRPbmx5OiAgICAgdGhpcy5wcm9wcy5yZWFkT25seSxcblx0XHRcdHRoZW1lOiAgICAgICAgdGhpcy5wcm9wcy50aGVtZSxcblx0XHRcdGZvcm1hdHM6ICAgICAgdGhpcy5wcm9wcy5mb3JtYXRzLFxuXHRcdFx0c3R5bGVzOiAgICAgICB0aGlzLnByb3BzLnN0eWxlcyxcblx0XHRcdG1vZHVsZXM6ICAgICAgdGhpcy5wcm9wcy5tb2R1bGVzLFxuXHRcdFx0cG9sbEludGVydmFsOiB0aGlzLnByb3BzLnBvbGxJbnRlcnZhbFxuXHRcdH07XG5cdFx0Ly8gVW5sZXNzIHdlJ3JlIHJlZGVmaW5pbmcgdGhlIHRvb2xiYXIsXG5cdFx0Ly8gYXR0YWNoIHRvIHRoZSBkZWZhdWx0IG9uZSBhcyBhIHJlZi5cblx0XHRpZiAoIWNvbmZpZy5tb2R1bGVzLnRvb2xiYXIpIHtcblx0XHRcdC8vIERvbid0IG11dGF0ZSB0aGUgb3JpZ2luYWwgbW9kdWxlc1xuXHRcdFx0Ly8gYmVjYXVzZSBpdCdzIHNoYXJlZCBiZXR3ZWVuIGNvbXBvbmVudHMuXG5cdFx0XHRjb25maWcubW9kdWxlcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uZmlnLm1vZHVsZXMpKTtcblx0XHRcdGNvbmZpZy5tb2R1bGVzLnRvb2xiYXIgPSB7XG5cdFx0XHRcdGNvbnRhaW5lcjogdGhpcy5yZWZzLnRvb2xiYXIuZ2V0RE9NTm9kZSgpXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gY29uZmlnO1xuXHR9LFxuXG5cdGdldEVkaXRvckVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnJlZnMuZWRpdG9yLmdldERPTU5vZGUoKTtcblx0fSxcblxuXHRnZXRFZGl0b3JDb250ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMudmFsdWUgfHwgdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUgfHwgJyc7XG5cdH0sXG5cblx0Z2V0Q2xhc3NOYW1lOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gWydxdWlsbCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lXS5qb2luKCcgJyk7XG5cdH0sXG5cblx0Lypcblx0UmVuZGVycyBlaXRoZXIgdGhlIHNwZWNpZmllZCBjb250ZW50cywgb3IgYSBkZWZhdWx0XG5cdGNvbmZpZ3VyYXRpb24gb2YgdG9vbGJhciBhbmQgY29udGVudHMgYXJlYS5cblx0Ki9cblx0cmVuZGVyQ29udGVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChSZWFjdC5DaGlsZHJlbi5jb3VudCh0aGlzLnByb3BzLmNoaWxkcmVuKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFF1aWxsVG9vbGJhcih7XG5cdFx0XHRcdFx0a2V5Oid0b29sYmFyJyxcblx0XHRcdFx0XHRyZWY6J3Rvb2xiYXInLFxuXHRcdFx0XHRcdGl0ZW1zOiB0aGlzLnByb3BzLnRvb2xiYXJcblx0XHRcdFx0fSksXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe1xuXHRcdFx0XHRcdGtleTonZWRpdG9yJyxcblx0XHRcdFx0XHRyZWY6J2VkaXRvcicsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiAncXVpbGwtY29udGVudHMnLFxuXHRcdFx0XHRcdGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDp0aGlzLmdldEVkaXRvckNvbnRlbnRzKCkgfVxuXHRcdFx0XHR9KVxuXHRcdFx0XTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmRpdih7XG5cdFx0XHRjbGFzc05hbWU6IHRoaXMuZ2V0Q2xhc3NOYW1lKCksXG5cdFx0XHRvbkNoYW5nZTogdGhpcy5wcmV2ZW50RGVmYXVsdCB9LFxuXHRcdFx0dGhpcy5yZW5kZXJDb250ZW50cygpXG5cdFx0KTtcblx0fSxcblxuXHQvKlxuXHRVcGRhdGVzIHRoZSBsb2NhbCBzdGF0ZSB3aXRoIHRoZSBuZXcgY29udGVudHMsXG5cdGV4ZWN1dGVzIHRoZSBjaGFuZ2UgaGFuZGxlciBwYXNzZWQgYXMgcHJvcHMuXG5cdCovXG5cdG9uRWRpdG9yQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qXG5cdFN0b3AgY2hhbmdlIGV2ZW50cyBmcm9tIHRoZSB0b29sYmFyIGZyb21cblx0YnViYmxpbmcgdXAgb3V0c2lkZS5cblx0Ki9cblx0cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbENvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFQgPSBSZWFjdC5Qcm9wVHlwZXM7XG5cbnZhciBkZWZhdWx0Q29sb3JzID0gW1xuXHQncmdiKCAgMCwgICAwLCAgIDApJywgJ3JnYigyMzAsICAgMCwgICAwKScsICdyZ2IoMjU1LCAxNTMsICAgMCknLFxuXHQncmdiKDI1NSwgMjU1LCAgIDApJywgJ3JnYiggIDAsIDEzOCwgICAwKScsICdyZ2IoICAwLCAxMDIsIDIwNCknLFxuXHQncmdiKDE1MywgIDUxLCAyNTUpJywgJ3JnYigyNTUsIDI1NSwgMjU1KScsICdyZ2IoMjUwLCAyMDQsIDIwNCknLFxuXHQncmdiKDI1NSwgMjM1LCAyMDQpJywgJ3JnYigyNTUsIDI1NSwgMjA0KScsICdyZ2IoMjA0LCAyMzIsIDIwNCknLFxuXHQncmdiKDIwNCwgMjI0LCAyNDUpJywgJ3JnYigyMzUsIDIxNCwgMjU1KScsICdyZ2IoMTg3LCAxODcsIDE4NyknLFxuXHQncmdiKDI0MCwgMTAyLCAxMDIpJywgJ3JnYigyNTUsIDE5NCwgMTAyKScsICdyZ2IoMjU1LCAyNTUsIDEwMiknLFxuXHQncmdiKDEwMiwgMTg1LCAxMDIpJywgJ3JnYigxMDIsIDE2MywgMjI0KScsICdyZ2IoMTk0LCAxMzMsIDI1NSknLFxuXHQncmdiKDEzNiwgMTM2LCAxMzYpJywgJ3JnYigxNjEsICAgMCwgICAwKScsICdyZ2IoMTc4LCAxMDcsICAgMCknLFxuXHQncmdiKDE3OCwgMTc4LCAgIDApJywgJ3JnYiggIDAsICA5NywgICAwKScsICdyZ2IoICAwLCAgNzEsIDE3OCknLFxuXHQncmdiKDEwNywgIDM2LCAxNzgpJywgJ3JnYiggNjgsICA2OCwgIDY4KScsICdyZ2IoIDkyLCAgIDAsICAgMCknLFxuXHQncmdiKDEwMiwgIDYxLCAgIDApJywgJ3JnYigxMDIsIDEwMiwgICAwKScsICdyZ2IoICAwLCAgNTUsICAgMCknLFxuXHQncmdiKCAgMCwgIDQxLCAxMDIpJywgJ3JnYiggNjEsICAyMCwgIDEwKScsXG5dLm1hcChmdW5jdGlvbihjb2xvcil7IHJldHVybiB7IHZhbHVlOiBjb2xvciB9IH0pO1xuXG52YXIgZGVmYXVsdEl0ZW1zID0gW1xuXG5cdHsgbGFiZWw6J0Zvcm1hdHMnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyBsYWJlbDonU2l6ZScsIHR5cGU6J3NpemUnLCBpdGVtczogW1xuXHRcdFx0eyBsYWJlbDonTm9ybWFsJywgdmFsdWU6JycgfSxcblx0XHRcdHsgbGFiZWw6J1NtYWxsZXInLCB2YWx1ZTonMC44ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidMYXJnZXInLCB2YWx1ZTonMS40ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidIdWdlJywgdmFsdWU6JzJlbScgfVxuXHRcdF19LFxuXHRcdHsgbGFiZWw6J0FsaWdubWVudCcsIHR5cGU6J2FsaWduJywgaXRlbXM6IFtcblx0XHRcdHsgbGFiZWw6J0NlbnRlcicsIHZhbHVlOidjZW50ZXInIH0sXG5cdFx0XHR7IGxhYmVsOidMZWZ0JywgdmFsdWU6J2xlZnQnIH0sXG5cdFx0XHR7IGxhYmVsOidSaWdodCcsIHZhbHVlOidyaWdodCcgfSxcblx0XHRcdHsgbGFiZWw6J0p1c3RpZnknLCB2YWx1ZTonanVzdGlmeScgfVxuXHRcdF19XG5cdF19LFxuXG5cdHsgbGFiZWw6J1RleHQnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyB0eXBlOidib2xkJywgbGFiZWw6J0JvbGQnIH0sXG5cdFx0eyB0eXBlOidpdGFsaWMnLCBsYWJlbDonSXRhbGljJyB9LFxuXHRcdHsgdHlwZTonc3RyaWtlJywgbGFiZWw6J1N0cmlrZScgfSxcblx0XHR7IHR5cGU6J3VuZGVybGluZScsIGxhYmVsOidVbmRlcmxpbmUnIH0sXG5cdFx0eyB0eXBlOidsaW5rJywgbGFiZWw6J0xpbmsnIH0sXG5cdFx0eyB0eXBlOidjb2xvcicsIGxhYmVsOidDb2xvcicsIGl0ZW1zOmRlZmF1bHRDb2xvcnMgfSxcblx0XX0sXG5cblx0eyBsYWJlbDonQmxvY2tzJywgdHlwZTonZ3JvdXAnLCBpdGVtczogW1xuXHRcdHsgdHlwZTonYnVsbGV0JywgbGFiZWw6J0J1bGxldCcgfSxcblx0XHR7IHR5cGU6J2xpc3QnLCBsYWJlbDonTGlzdCcgfVxuXHRdfVxuXG5dO1xuXG52YXIgUXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGRpc3BsYXlOYW1lOiAnUXVpbGwgVG9vbGJhcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aWQ6ICAgICAgICBULnN0cmluZyxcblx0XHRjbGFzc05hbWU6IFQuc3RyaW5nLFxuXHRcdGl0ZW1zOiAgICAgVC5hcnJheVxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXRlbXM6IGRlZmF1bHRJdGVtc1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyU2VwYXJhdG9yOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zcGFuKHtcblx0XHRcdGNsYXNzTmFtZToncWwtZm9ybWF0LXNlcGFyYXRvcidcblx0XHR9KTtcblx0fSxcblxuXHRyZW5kZXJHcm91cDogZnVuY3Rpb24oaXRlbSkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwsXG5cdFx0XHRjbGFzc05hbWU6J3FsLWZvcm1hdC1ncm91cCcgfSxcblx0XHRcdGl0ZW0uaXRlbXMubWFwKHRoaXMucmVuZGVySXRlbSlcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckNob2ljZUl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLm9wdGlvbih7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YWx1ZSxcblx0XHRcdHZhbHVlOml0ZW0udmFsdWUgfSxcblx0XHRcdGl0ZW0ubGFiZWxcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckNob2ljZXM6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLnNlbGVjdCh7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwsXG5cdFx0XHRjbGFzc05hbWU6ICdxbC0nK2l0ZW0udHlwZSB9LFxuXHRcdFx0aXRlbS5pdGVtcy5tYXAodGhpcy5yZW5kZXJDaG9pY2VJdGVtKVxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyQWN0aW9uOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zcGFuKHtcblx0XHRcdGtleTogaXRlbS5sYWJlbCB8fCBpdGVtLnZhbHVlLFxuXHRcdFx0Y2xhc3NOYW1lOiAncWwtZm9ybWF0LWJ1dHRvbiBxbC0nK2l0ZW0udHlwZSxcblx0XHRcdHRpdGxlOiBpdGVtLmxhYmVsIH1cblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRzd2l0Y2ggKGl0ZW0udHlwZSkge1xuXHRcdFx0Y2FzZSAnc2VwYXJhdG9yJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyU2VwYXJhdG9yKCk7XG5cdFx0XHRjYXNlICdncm91cCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbmRlckdyb3VwKGl0ZW0pO1xuXHRcdFx0Y2FzZSAnZm9udCc6XG5cdFx0XHRjYXNlICdhbGlnbic6XG5cdFx0XHRjYXNlICdzaXplJzpcblx0XHRcdGNhc2UgJ2NvbG9yJzpcblx0XHRcdGNhc2UgJ2JhY2tncm91bmQnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJDaG9pY2VzKGl0ZW0pO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyQWN0aW9uKGl0ZW0pO1xuXHRcdH1cblx0fSxcblxuXHRnZXRDbGFzc05hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAncXVpbGwtdG9vbGJhciAnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lfHwnJyk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmRpdih7XG5cdFx0XHRjbGFzc05hbWU6IHRoaXMuZ2V0Q2xhc3NOYW1lKCkgfSxcblx0XHRcdHRoaXMucHJvcHMuaXRlbXMubWFwKHRoaXMucmVuZGVySXRlbSlcblx0XHQpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWxsVG9vbGJhcjtcblF1aWxsVG9vbGJhci5kZWZhdWx0SXRlbXMgPSBkZWZhdWx0SXRlbXM7XG5RdWlsbFRvb2xiYXIuZGVmYXVsdENvbG9ycyA9IGRlZmF1bHRDb2xvcnM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90b29sYmFyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUXVpbGwgPSByZXF1aXJlKCdxdWlsbCcpO1xuXG52YXIgUXVpbGxNaXhpbiA9IHtcblxuXHQvKipcblx0Q3JlYXRlcyBhbiBlZGl0b3Igb24gdGhlIGdpdmVuIGVsZW1lbnQuIFRoZSBlZGl0b3Igd2lsbFxuXHRiZSBwYXNzZWQgdGhlIGNvbmZpZ3VyYXRpb24sIGhhdmUgaXRzIGV2ZW50cyBib3VuZCxcblx0Ki9cblx0Y3JlYXRlRWRpdG9yOiBmdW5jdGlvbigkZWwsIGNvbmZpZykge1xuXHRcdHZhciBlZGl0b3IgPSBuZXcgUXVpbGwoJGVsLCBjb25maWcpO1xuXHRcdHRoaXMuaG9va0VkaXRvcihlZGl0b3IpO1xuXHRcdHJldHVybiBlZGl0b3I7XG5cdH0sXG5cblx0aG9va0VkaXRvcjogZnVuY3Rpb24oZWRpdG9yKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdGVkaXRvci5vbigndGV4dC1jaGFuZ2UnLCBmdW5jdGlvbihkZWx0YSwgc291cmNlKSB7XG5cdFx0XHRpZiAoc2VsZi5vbkVkaXRvckNoYW5nZSkge1xuXHRcdFx0XHRzZWxmLm9uRWRpdG9yQ2hhbmdlKGVkaXRvci5nZXRIVE1MKCksIGRlbHRhLCBzb3VyY2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdHVwZGF0ZUVkaXRvcjogZnVuY3Rpb24oZWRpdG9yLCBjb25maWcpIHtcblx0XHQvLyBOT1RFOiBUaGlzIHRlYXJzIHRoZSBlZGl0b3IgZG93biwgYW5kIHJlaW5pdGlhbGl6ZXNcblx0XHQvLyAgICAgICBpdCB3aXRoIHRoZSBuZXcgY29uZmlnLiBVZ2x5IGJ1dCBuZWNlc3Nhcnlcblx0XHQvLyAgICAgICBhcyB0aGVyZSBpcyBubyBhcGkgZm9yIHVwZGF0aW5nIGl0LlxuXHRcdHRoaXMuZGVzdHJveUVkaXRvcihlZGl0b3IpO1xuXHRcdHRoaXMuY3JlYXRlRWRpdG9yKGNvbmZpZyk7XG5cdFx0cmV0dXJuIGVkaXRvcjtcblx0fSxcblxuXHRkZXN0cm95RWRpdG9yOiBmdW5jdGlvbihlZGl0b3IpIHtcblx0XHRlZGl0b3IuZGVzdHJveSgpO1xuXHR9LFxuXG5cdC8qXG5cdFJlcGxhY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBlZGl0b3IsIGJ1dCBrZWVwXG5cdHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gaGFuZ2luZyBhcm91bmQgc28gdGhhdFxuXHR0aGUgY3Vyc29yIHdvbid0IG1vdmUuXG5cdCovXG5cdHNldEVkaXRvckNvbnRlbnRzOiBmdW5jdGlvbihlZGl0b3IsIHZhbHVlKSB7XG5cdFx0dmFyIHNlbCA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcblx0XHRlZGl0b3Iuc2V0SFRNTCh2YWx1ZSk7XG5cdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWwpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpbGxNaXhpbjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21peGluLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzVfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn1cbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9