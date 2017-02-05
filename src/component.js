'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var QuillToolbar = require('./toolbar');
var QuillMixin = require('./mixin');
var find = require('lodash/find');
var isEqual = require('lodash/isEqual');
var T = React.PropTypes;

// FIXME: Remove with the switch to JSX
QuillToolbar = React.createFactory(QuillToolbar);

var QuillComponent = React.createClass({

	displayName: 'Quill',

	mixins: [ QuillMixin ],

	propTypes: {
		id: T.string,
		className: T.string,
		theme: T.string,
		style: T.object,
		readOnly: T.bool,
		value: T.string,
		defaultValue: T.string,
		placeholder: T.string,
		modules: T.object,
		toolbar: T.oneOfType([ T.array, T.oneOf([false]), ]), // deprecated for v1.0.0, use toolbar module
		formats: T.array,
		styles: T.oneOfType([ T.object, T.oneOf([false]) ]),
		onKeyPress: T.func,
		onKeyDown: T.func,
		onKeyUp: T.func,
		onChange: T.func,
		onChangeSelection: T.func,

		pollInterval: function(props) {
			if ('pollInterval' in props) return new Error(
				'The `pollInterval` property does not have any effect anymore. ' +
				'You can safely remove it from your props.' +
				'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
			);
		}
	},
		
	/*
	Changing one of these props should cause a re-render.
	*/
	dirtyProps: [
		'id',
		'className',
		'modules',
		'toolbar',
		'formats',
		'styles',
		'theme',
	],

	getDefaultProps: function() {
		return {
			className: '',
			theme: 'snow',
			modules: {},
		};
	},

	/*
	We consider the component to be controlled if
	whenever `value` is bein sent in props.
	*/
	isControlled: function() {
		return 'value' in this.props;
	},

	getInitialState: function() {
		return {
			value: this.isControlled()
				? this.props.value
				: this.props.defaultValue
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var editor = this.state.editor;
		// If the component is unmounted and mounted too quickly
		// an error is thrown in setEditorContents since editor is
		// still undefined. Must check if editor is undefined
		// before performing this call.
		if (editor) {
			// Update only if we've been passed a new `value`.
			// This leaves components using `defaultValue` alone.
			if ('value' in nextProps) {
				// NOTE: Seeing that Quill is missing a way to prevent
				//       edits, we have to settle for a hybrid between
				//       controlled and uncontrolled mode. We can't prevent
				//       the change, but we'll still override content
				//       whenever `value` differs from current state.
				if (nextProps.value !== this.getEditorContents()) {
					this.setEditorContents(editor, nextProps.value);
				}
			}
			// We can update readOnly state in-place.
			if ('readOnly' in nextProps) {
				if (nextProps.readOnly !== this.props.readOnly) {
					this.setEditorReadOnly(editor, nextProps.readOnly);
				}
			}
		}
	},

	componentDidMount: function() {
		var editor = this.createEditor(
			this.getEditorElement(),
			this.getEditorConfig());

		var fontOptions = document.querySelectorAll(
			'.quill-toolbar .ql-font.ql-picker .ql-picker-item'
		);

		for (var i=0; i<fontOptions.length; ++i) {
			fontOptions[i].style.fontFamily = fontOptions[i].dataset.value;
		}

		this.setState({ editor:editor });
	},

	componentWillUnmount: function() {
		// NOTE: Don't set the state to null here
		//       as it would generate a loop.
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		// Check if one of the changes should trigger a re-render.
		for (var i=0; i<this.dirtyProps.length; i++) {
			var prop = this.dirtyProps[i];
			if (!isEqual(nextProps[prop], this.props[prop])) {
				return true;
			}
		}
		// Never re-render otherwise.
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

	/**
	 * @deprecated v1.0.0
	 */
	setCustomFormats: function (editor) {
		if (!this.props.formats) {
			return;
		}

		for (var i = 0; i < this.props.formats.length; i++) {
			var format = this.props.formats[i];
			editor.addFormat(format.name || format, format);
		}
	},

	getEditorConfig: function() {
		var config = {
			readOnly:     this.props.readOnly,
			theme:        this.props.theme,
			formats:      this.props.formats,
			styles:       this.props.styles,
			modules:      this.props.modules,
			bounds:       this.props.bounds,
			placeholder:  this.props.placeholder,
		};
		// Unless we're redefining the toolbar, or it has been explicitly
		// disabled, attach to the default one as a ref.
		// Note: Toolbar should be configured as a module for Quill v1.0.0 and above
		// Pass toolbar={false} for versions >1.0
		if (this.props.toolbar !== false && !config.modules.toolbar) {
			// Don't mutate the original `modules`
			// because it's shared between components.
			config.modules = JSON.parse(JSON.stringify(config.modules));
			config.modules.toolbar = {
				container: ReactDOM.findDOMNode(this.refs.toolbar)
			}
		}
		return config;
	},

	getEditor: function() {
		return this.state.editor;
	},

	getEditorElement: function() {
		return ReactDOM.findDOMNode(this.refs.editor);
	},

	getEditorContents: function() {
		return this.state.value;
	},

	getEditorSelection: function() {
		return this.state.selection;
	},

	/*
	Renders either the specified contents, or a default
	configuration of toolbar and contents area.
	*/
	renderContents: function() {
		var contents = [];
		var children = React.Children.map(
			this.props.children,
			function(c) { return React.cloneElement(c, {ref: c.ref}); }
		);

		if (this.props.toolbar !== false) {
			var toolbar = find(children, function(child) {
				return child.ref === 'toolbar';
			})
			contents.push(toolbar || QuillToolbar({
				key: 'toolbar-' + Math.random(),
				ref: 'toolbar',
				items: this.props.toolbar
			}));
		}

		var editor = find(children, function(child) {
			return child.ref === 'editor';
		});
		contents.push(editor || React.DOM.div({
			key: 'editor-' + Math.random(),
			ref: 'editor',
			className: 'quill-contents',
			dangerouslySetInnerHTML: { __html:this.getEditorContents() }
		}));

		return contents;
	},

	render: function() {
		return React.DOM.div({
			id: this.props.id,
			style: this.props.style,
			className: ['quill'].concat(this.props.className).join(' '),
			onKeyPress: this.props.onKeyPress,
			onKeyDown: this.props.onKeyDown,
			onKeyUp: this.props.onKeyUp,
			onChange: this.preventDefault },
			this.renderContents()
		);
	},

	onEditorChange: function(value, delta, source, editor) {
		if (value !== this.getEditorContents()) {
			this.setState({ value: value });
			if (this.props.onChange) {
				this.props.onChange(value, delta, source, editor);
			}
		}
	},

	onEditorChangeSelection: function(range, source, editor) {
		var s = this.getEditorSelection() || {};
		var r = range || {};
		if (r.length !== s.length || r.index !== s.index) {
			this.setState({ selection: range });
			if (this.props.onChangeSelection) {
				this.props.onChangeSelection(range, source, editor);
			}
		}
	},

	focus: function() {
		this.state.editor.focus();
	},

	blur: function() {
		this.setEditorSelection(this.state.editor, null);
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
