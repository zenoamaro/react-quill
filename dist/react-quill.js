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
	QuillToolbar.defaultItems = defaultItems;
	QuillToolbar.defaultColors = defaultColors;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1YTBjZDkzZTVjNmY1N2RjY2VmNiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2xiYXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJxdWlsbFwiLFwiY29tbW9uanMyXCI6XCJxdWlsbFwiLFwiYW1kXCI6XCJxdWlsbFwiLFwicm9vdFwiOlwiUXVpbGxcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVG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Q0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxHQUFFOztBQUVGO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBLDRDOzs7Ozs7Ozs7QUNsSUEsZ0Q7Ozs7Ozs7OztBQ0FBLGdEIiwiZmlsZSI6Ii4vZGlzdC9yZWFjdC1xdWlsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIiwgXCJxdWlsbFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFF1aWxsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIiksIHJlcXVpcmUoXCJxdWlsbFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVhY3RRdWlsbFwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wiUXVpbGxcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV80X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA1YTBjZDkzZTVjNmY1N2RjY2VmNlxuICoqLyIsIi8qXG5SZWFjdC1RdWlsbCB2MC4wLjNcbmh0dHBzOi8vZ2l0aHViLmNvbS96ZW5vYW1hcm8vcmVhY3QtcXVpbGxcbiovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50Jyk7XG5tb2R1bGUuZXhwb3J0cy5NaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKTtcbm1vZHVsZS5leHBvcnRzLlRvb2xiYXIgPSByZXF1aXJlKCcuL3Rvb2xiYXInKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFF1aWxsVG9vbGJhciA9IHJlcXVpcmUoJy4vdG9vbGJhcicpLFxuXHRRdWlsbE1peGluID0gcmVxdWlyZSgnLi9taXhpbicpLFxuXHRUID0gUmVhY3QuUHJvcFR5cGVzO1xuXG4vLyBTdXBwb3J0IFJlYWN0IDAuMTEgYW5kIDAuMTJcbi8vIEZJWE1FOiBSZW1vdmUgd2l0aCBSZWFjdCAwLjEzXG5pZiAoUmVhY3QuY3JlYXRlRmFjdG9yeSkge1xuXHRRdWlsbFRvb2xiYXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFF1aWxsVG9vbGJhcik7XG59XG5cbnZhciBRdWlsbENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1F1aWxsJyxcblxuXHRtaXhpbnM6IFsgUXVpbGxNaXhpbiBdLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGlkOiAgICAgICAgICAgVC5zdHJpbmcsXG5cdFx0Y2xhc3NOYW1lOiAgICBULnN0cmluZyxcblx0XHR2YWx1ZTogICAgICAgIFQuc3RyaW5nLFxuXHRcdGRlZmF1bHRWYWx1ZTogVC5zdHJpbmcsXG5cdFx0cmVhZE9ubHk6ICAgICBULmJvb2wsXG5cdFx0dG9vbGJhcjogICAgICBULm9iamVjdCxcblx0XHRmb3JtYXRzOiAgICAgIFQuYXJyYXksXG5cdFx0c3R5bGVzOiAgICAgICBULm9iamVjdCxcblx0XHR0aGVtZTogICAgICAgIFQuc3RyaW5nLFxuXHRcdHBvbGxJbnRlcnZhbDogVC5udW1iZXIsXG5cdFx0b25DaGFuZ2U6ICAgICBULmZ1bmNcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjbGFzc05hbWU6ICcnLFxuXHRcdFx0dGhlbWU6ICdiYXNlJyxcblx0XHRcdG1vZHVsZXM6IHt9XG5cdFx0fTtcblx0fSxcblxuXHQvKlxuXHRSZXRyaWV2ZSB0aGUgaW5pdGlhbCB2YWx1ZSBmcm9tIGVpdGhlciBgdmFsdWVgIChwcmVmZXJyZWQpXG5cdG9yIGBkZWZhdWx0VmFsdWVgIGlmIHlvdSB3YW50IGFuIHVuLWNvbnRyb2xsZWQgY29tcG9uZW50LlxuXHQqL1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7fTtcblx0fSxcblxuXHQvKlxuXHRVcGRhdGUgb25seSBpZiB3ZSd2ZSBiZWVuIHBhc3NlZCBhIG5ldyBgdmFsdWVgLlxuXHRUaGlzIGxlYXZlcyBjb21wb25lbnRzIHVzaW5nIGBkZWZhdWx0VmFsdWVgIGFsb25lLlxuXHQqL1xuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRpZiAoJ3ZhbHVlJyBpbiBuZXh0UHJvcHMpIHtcblx0XHRcdGlmIChuZXh0UHJvcHMudmFsdWUgIT09IHRoaXMucHJvcHMudmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRFZGl0b3JDb250ZW50cyh0aGlzLnN0YXRlLmVkaXRvciwgbmV4dFByb3BzLnZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcihcblx0XHRcdHRoaXMuZ2V0RWRpdG9yRWxlbWVudCgpLFxuXHRcdFx0dGhpcy5nZXRFZGl0b3JDb25maWcoKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGVkaXRvcjplZGl0b3IgfSk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZGVzdHJveUVkaXRvcih0aGlzLnN0YXRlLmVkaXRvcik7XG5cdFx0Ly8gTk9URTogRG9uJ3Qgc2V0IHRoZSBzdGF0ZSB0byBudWxsIGhlcmVcblx0XHQvLyAgICAgICBhcyBpdCB3b3VsZCBnZW5lcmF0ZSBhIGxvb3AuXG5cdH0sXG5cblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuXHRcdC8vIE5ldmVyIHJlLXJlbmRlciBvciB3ZSBsb3NlIHRoZSBlbGVtZW50LlxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHQvKlxuXHRJZiBmb3Igd2hhdGV2ZXIgcmVhc29uIHdlIGFyZSByZW5kZXJpbmcgYWdhaW4sXG5cdHdlIHNob3VsZCB0ZWFyIGRvd24gdGhlIGVkaXRvciBhbmQgYnJpbmcgaXQgdXBcblx0YWdhaW4uXG5cdCovXG5cdGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcblx0fSxcblxuXHRnZXRFZGl0b3JDb25maWc6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb25maWcgPSB7XG5cdFx0XHRyZWFkT25seTogICAgIHRoaXMucHJvcHMucmVhZE9ubHksXG5cdFx0XHR0aGVtZTogICAgICAgIHRoaXMucHJvcHMudGhlbWUsXG5cdFx0XHRmb3JtYXRzOiAgICAgIHRoaXMucHJvcHMuZm9ybWF0cyxcblx0XHRcdHN0eWxlczogICAgICAgdGhpcy5wcm9wcy5zdHlsZXMsXG5cdFx0XHRtb2R1bGVzOiAgICAgIHRoaXMucHJvcHMubW9kdWxlcyxcblx0XHRcdHBvbGxJbnRlcnZhbDogdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWxcblx0XHR9O1xuXHRcdC8vIFVubGVzcyB3ZSdyZSByZWRlZmluaW5nIHRoZSB0b29sYmFyLFxuXHRcdC8vIGF0dGFjaCB0byB0aGUgZGVmYXVsdCBvbmUgYXMgYSByZWYuXG5cdFx0aWYgKCFjb25maWcubW9kdWxlcy50b29sYmFyKSB7XG5cdFx0XHQvLyBEb24ndCBtdXRhdGUgdGhlIG9yaWdpbmFsIG1vZHVsZXNcblx0XHRcdC8vIGJlY2F1c2UgaXQncyBzaGFyZWQgYmV0d2VlbiBjb21wb25lbnRzLlxuXHRcdFx0Y29uZmlnLm1vZHVsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNvbmZpZy5tb2R1bGVzKSk7XG5cdFx0XHRjb25maWcubW9kdWxlcy50b29sYmFyID0ge1xuXHRcdFx0XHRjb250YWluZXI6IHRoaXMucmVmcy50b29sYmFyLmdldERPTU5vZGUoKVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbmZpZztcblx0fSxcblxuXHRnZXRFZGl0b3JFbGVtZW50OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5yZWZzLmVkaXRvci5nZXRET01Ob2RlKCk7XG5cdH0sXG5cblx0Z2V0RWRpdG9yQ29udGVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnZhbHVlIHx8IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlO1xuXHR9LFxuXG5cdGdldENsYXNzTmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFsncXVpbGwnLCB0aGlzLnByb3BzLmNsYXNzTmFtZV0uam9pbignICcpO1xuXHR9LFxuXG5cdC8qXG5cdFJlbmRlcnMgZWl0aGVyIHRoZSBzcGVjaWZpZWQgY29udGVudHMsIG9yIGEgZGVmYXVsdFxuXHRjb25maWd1cmF0aW9uIG9mIHRvb2xiYXIgYW5kIGNvbnRlbnRzIGFyZWEuXG5cdCovXG5cdHJlbmRlckNvbnRlbnRzOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoUmVhY3QuQ2hpbGRyZW4uY291bnQodGhpcy5wcm9wcy5jaGlsZHJlbikgPiAwKSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0UXVpbGxUb29sYmFyKHtcblx0XHRcdFx0XHRrZXk6J3Rvb2xiYXInLFxuXHRcdFx0XHRcdHJlZjondG9vbGJhcicsXG5cdFx0XHRcdFx0aXRlbXM6IHRoaXMucHJvcHMudG9vbGJhclxuXHRcdFx0XHR9KSxcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7XG5cdFx0XHRcdFx0a2V5OidlZGl0b3InLFxuXHRcdFx0XHRcdHJlZjonZWRpdG9yJyxcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdxdWlsbC1jb250ZW50cycsXG5cdFx0XHRcdFx0ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOnRoaXMuZ2V0RWRpdG9yQ29udGVudHMoKSB9XG5cdFx0XHRcdH0pXG5cdFx0XHRdO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uZGl2KHtcblx0XHRcdGNsYXNzTmFtZTogdGhpcy5nZXRDbGFzc05hbWUoKSxcblx0XHRcdG9uQ2hhbmdlOiB0aGlzLnByZXZlbnREZWZhdWx0IH0sXG5cdFx0XHR0aGlzLnJlbmRlckNvbnRlbnRzKClcblx0XHQpO1xuXHR9LFxuXG5cdC8qXG5cdFVwZGF0ZXMgdGhlIGxvY2FsIHN0YXRlIHdpdGggdGhlIG5ldyBjb250ZW50cyxcblx0ZXhlY3V0ZXMgdGhlIGNoYW5nZSBoYW5kbGVyIHBhc3NlZCBhcyBwcm9wcy5cblx0Ki9cblx0b25FZGl0b3JDaGFuZ2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Lypcblx0U3RvcCBjaGFuZ2UgZXZlbnRzIGZyb20gdGhlIHRvb2xiYXIgZnJvbVxuXHRidWJibGluZyB1cCBvdXRzaWRlLlxuXHQqL1xuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWxsQ29tcG9uZW50O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRRdWlsbCA9IHJlcXVpcmUoJ3F1aWxsJyksXG5cdFQgPSBSZWFjdC5Qcm9wVHlwZXM7XG5cbnZhciBRdWlsbE1peGluID0ge1xuXG5cdC8qKlxuXHRDcmVhdGVzIGFuIGVkaXRvciBvbiB0aGUgZ2l2ZW4gZWxlbWVudC4gVGhlIGVkaXRvciB3aWxsXG5cdGJlIHBhc3NlZCB0aGUgY29uZmlndXJhdGlvbiwgaGF2ZSBpdHMgZXZlbnRzIGJvdW5kLFxuXHQqL1xuXHRjcmVhdGVFZGl0b3I6IGZ1bmN0aW9uKCRlbCwgY29uZmlnKSB7XG5cdFx0dmFyIGVkaXRvciA9IG5ldyBRdWlsbCgkZWwsIGNvbmZpZyk7XG5cdFx0dGhpcy5ob29rRWRpdG9yKGVkaXRvcik7XG5cdFx0cmV0dXJuIGVkaXRvcjtcblx0fSxcblxuXHRob29rRWRpdG9yOiBmdW5jdGlvbihlZGl0b3IpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0ZWRpdG9yLm9uKCd0ZXh0LWNoYW5nZScsIGZ1bmN0aW9uKGRlbHRhLCBzb3VyY2UpIHtcblx0XHRcdGlmIChzZWxmLm9uRWRpdG9yQ2hhbmdlKSB7XG5cdFx0XHRcdHNlbGYub25FZGl0b3JDaGFuZ2UoZWRpdG9yLmdldEhUTUwoKSwgZGVsdGEsIHNvdXJjZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0dXBkYXRlRWRpdG9yOiBmdW5jdGlvbihlZGl0b3IsIGNvbmZpZykge1xuXHRcdC8vIE5PVEU6IFRoaXMgdGVhcnMgdGhlIGVkaXRvciBkb3duLCBhbmQgcmVpbml0aWFsaXplc1xuXHRcdC8vICAgICAgIGl0IHdpdGggdGhlIG5ldyBjb25maWcuIFVnbHkgYnV0IG5lY2Vzc2FyeVxuXHRcdC8vICAgICAgIGFzIHRoZXJlIGlzIG5vIGFwaSBmb3IgdXBkYXRpbmcgaXQuXG5cdFx0dGhpcy5kZXN0cm95RWRpdG9yKGVkaXRvcik7XG5cdFx0dGhpcy5jcmVhdGVFZGl0b3IoY29uZmlnKTtcblx0XHRyZXR1cm4gZWRpdG9yO1xuXHR9LFxuXG5cdGRlc3Ryb3lFZGl0b3I6IGZ1bmN0aW9uKGVkaXRvcikge1xuXHRcdGVkaXRvci5kZXN0cm95KCk7XG5cdH0sXG5cblx0Lypcblx0UmVwbGFjZSB0aGUgY29udGVudHMgb2YgdGhlIGVkaXRvciwgYnV0IGtlZXBcblx0dGhlIHByZXZpb3VzIHNlbGVjdGlvbiBoYW5naW5nIGFyb3VuZCBzbyB0aGF0XG5cdHRoZSBjdXJzb3Igd29uJ3QgbW92ZS5cblx0Ki9cblx0c2V0RWRpdG9yQ29udGVudHM6IGZ1bmN0aW9uKGVkaXRvciwgdmFsdWUpIHtcblx0XHR2YXIgc2VsID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuXHRcdGVkaXRvci5zZXRIVE1MKHZhbHVlKTtcblx0XHRlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbCk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlsbE1peGluO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWl4aW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFQgPSBSZWFjdC5Qcm9wVHlwZXM7XG5cbnZhciBkZWZhdWx0Q29sb3JzID0gW1xuXHQncmdiKCAgMCwgICAwLCAgIDApJywgJ3JnYigyMzAsICAgMCwgICAwKScsICdyZ2IoMjU1LCAxNTMsICAgMCknLFxuXHQncmdiKDI1NSwgMjU1LCAgIDApJywgJ3JnYiggIDAsIDEzOCwgICAwKScsICdyZ2IoICAwLCAxMDIsIDIwNCknLFxuXHQncmdiKDE1MywgIDUxLCAyNTUpJywgJ3JnYigyNTUsIDI1NSwgMjU1KScsICdyZ2IoMjUwLCAyMDQsIDIwNCknLFxuXHQncmdiKDI1NSwgMjM1LCAyMDQpJywgJ3JnYigyNTUsIDI1NSwgMjA0KScsICdyZ2IoMjA0LCAyMzIsIDIwNCknLFxuXHQncmdiKDIwNCwgMjI0LCAyNDUpJywgJ3JnYigyMzUsIDIxNCwgMjU1KScsICdyZ2IoMTg3LCAxODcsIDE4NyknLFxuXHQncmdiKDI0MCwgMTAyLCAxMDIpJywgJ3JnYigyNTUsIDE5NCwgMTAyKScsICdyZ2IoMjU1LCAyNTUsIDEwMiknLFxuXHQncmdiKDEwMiwgMTg1LCAxMDIpJywgJ3JnYigxMDIsIDE2MywgMjI0KScsICdyZ2IoMTk0LCAxMzMsIDI1NSknLFxuXHQncmdiKDEzNiwgMTM2LCAxMzYpJywgJ3JnYigxNjEsICAgMCwgICAwKScsICdyZ2IoMTc4LCAxMDcsICAgMCknLFxuXHQncmdiKDE3OCwgMTc4LCAgIDApJywgJ3JnYiggIDAsICA5NywgICAwKScsICdyZ2IoICAwLCAgNzEsIDE3OCknLFxuXHQncmdiKDEwNywgIDM2LCAxNzgpJywgJ3JnYiggNjgsICA2OCwgIDY4KScsICdyZ2IoIDkyLCAgIDAsICAgMCknLFxuXHQncmdiKDEwMiwgIDYxLCAgIDApJywgJ3JnYigxMDIsIDEwMiwgICAwKScsICdyZ2IoICAwLCAgNTUsICAgMCknLFxuXHQncmdiKCAgMCwgIDQxLCAxMDIpJywgJ3JnYiggNjEsICAyMCwgIDEwKScsXG5dLm1hcChmdW5jdGlvbihjb2xvcil7IHJldHVybiB7IHZhbHVlOiBjb2xvciB9IH0pO1xuXG52YXIgZGVmYXVsdEl0ZW1zID0gW1xuXG5cdHsgbGFiZWw6J0Zvcm1hdHMnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyBsYWJlbDonU2l6ZScsIHR5cGU6J3NpemUnLCBpdGVtczogW1xuXHRcdFx0eyBsYWJlbDonTm9ybWFsJywgdmFsdWU6JycgfSxcblx0XHRcdHsgbGFiZWw6J1NtYWxsZXInLCB2YWx1ZTonMC44ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidMYXJnZXInLCB2YWx1ZTonMS40ZW0nIH0sXG5cdFx0XHR7IGxhYmVsOidIdWdlJywgdmFsdWU6JzJlbScgfVxuXHRcdF19LFxuXHRcdHsgbGFiZWw6J0FsaWdubWVudCcsIHR5cGU6J2FsaWduJywgaXRlbXM6IFtcblx0XHRcdHsgbGFiZWw6J0NlbnRlcicsIHZhbHVlOidjZW50ZXInIH0sXG5cdFx0XHR7IGxhYmVsOidMZWZ0JywgdmFsdWU6J2xlZnQnIH0sXG5cdFx0XHR7IGxhYmVsOidSaWdodCcsIHZhbHVlOidyaWdodCcgfSxcblx0XHRcdHsgbGFiZWw6J0p1c3RpZnknLCB2YWx1ZTonanVzdGlmeScgfVxuXHRcdF19XG5cdF19LFxuXG5cdHsgbGFiZWw6J1RleHQnLCB0eXBlOidncm91cCcsIGl0ZW1zOiBbXG5cdFx0eyB0eXBlOidib2xkJywgbGFiZWw6J0JvbGQnIH0sXG5cdFx0eyB0eXBlOidpdGFsaWMnLCBsYWJlbDonSXRhbGljJyB9LFxuXHRcdHsgdHlwZTonc3RyaWtlJywgbGFiZWw6J1N0cmlrZScgfSxcblx0XHR7IHR5cGU6J3VuZGVybGluZScsIGxhYmVsOidVbmRlcmxpbmUnIH0sXG5cdFx0eyB0eXBlOidsaW5rJywgbGFiZWw6J0xpbmsnIH0sXG5cdFx0eyB0eXBlOidjb2xvcicsIGxhYmVsOidDb2xvcicsIGl0ZW1zOmRlZmF1bHRDb2xvcnMgfSxcblx0XX0sXG5cblx0eyBsYWJlbDonQmxvY2tzJywgdHlwZTonZ3JvdXAnLCBpdGVtczogW1xuXHRcdHsgdHlwZTonYnVsbGV0JywgbGFiZWw6J0J1bGxldCcgfSxcblx0XHR7IHR5cGU6J2xpc3QnLCBsYWJlbDonTGlzdCcgfVxuXHRdfVxuXG5dO1xuXG52YXIgUXVpbGxUb29sYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGRpc3BsYXlOYW1lOiAnUXVpbGwgVG9vbGJhcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0aWQ6ICAgICAgICBULnN0cmluZyxcblx0XHRjbGFzc05hbWU6IFQuc3RyaW5nLFxuXHRcdGl0ZW1zOiAgICAgVC5hcnJheVxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXRlbXM6IGRlZmF1bHRJdGVtc1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyR3JvdXA6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOidxbC1mb3JtYXQtZ3JvdXAnIH0sXG5cdFx0XHRpdGVtLml0ZW1zLm1hcCh0aGlzLnJlbmRlckl0ZW0pXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5vcHRpb24oe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsIHx8IGl0ZW0udmFsdWUsXG5cdFx0XHR2YWx1ZTppdGVtLnZhbHVlIH0sXG5cdFx0XHRpdGVtLmxhYmVsXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJDaG9pY2VzOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5zZWxlY3Qoe1xuXHRcdFx0a2V5OiBpdGVtLmxhYmVsLFxuXHRcdFx0Y2xhc3NOYW1lOiAncWwtJytpdGVtLnR5cGUgfSxcblx0XHRcdGl0ZW0uaXRlbXMubWFwKHRoaXMucmVuZGVyQ2hvaWNlSXRlbSlcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckFjdGlvbjogZnVuY3Rpb24oaXRlbSkge1xuXHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7XG5cdFx0XHRrZXk6IGl0ZW0ubGFiZWwgfHwgaXRlbS52YWx1ZSxcblx0XHRcdGNsYXNzTmFtZTogJ3FsLWZvcm1hdC1idXR0b24gcWwtJytpdGVtLnR5cGUsXG5cdFx0XHR0aXRsZTogaXRlbS5sYWJlbCB9XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0c3dpdGNoIChpdGVtLnR5cGUpIHtcblx0XHRcdGNhc2UgJ2dyb3VwJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyR3JvdXAoaXRlbSk7XG5cdFx0XHRjYXNlICdhbGlnbic6XG5cdFx0XHRjYXNlICdzaXplJzpcblx0XHRcdGNhc2UgJ2NvbG9yJzpcblx0XHRcdGNhc2UgJ2JhY2tncm91bmQnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJDaG9pY2VzKGl0ZW0pO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyQWN0aW9uKGl0ZW0pO1xuXHRcdH1cblx0fSxcblxuXHRnZXRDbGFzc05hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAncXVpbGwtdG9vbGJhciAnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lfHwnJyk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmRpdih7XG5cdFx0XHRjbGFzc05hbWU6IHRoaXMuZ2V0Q2xhc3NOYW1lKCkgfSxcblx0XHRcdHRoaXMucHJvcHMuaXRlbXMubWFwKHRoaXMucmVuZGVySXRlbSlcblx0XHQpO1xuXHR9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWxsVG9vbGJhcjtcblF1aWxsVG9vbGJhci5kZWZhdWx0SXRlbXMgPSBkZWZhdWx0SXRlbXM7XG5RdWlsbFRvb2xiYXIuZGVmYXVsdENvbG9ycyA9IGRlZmF1bHRDb2xvcnM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90b29sYmFyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiY29tbW9uanMyXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwiLFwicm9vdFwiOlwiUmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInF1aWxsXCIsXCJjb21tb25qczJcIjpcInF1aWxsXCIsXCJhbWRcIjpcInF1aWxsXCIsXCJyb290XCI6XCJRdWlsbFwifVxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=