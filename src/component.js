'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var QuillMixin = require('./mixin');
var find = require('lodash/find');
var some = require('lodash/some');
var isEqual = require('lodash/isEqual');
var T = React.PropTypes;

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
		bounds: T.oneOfType([T.string, T.element]),
		onKeyPress: T.func,
		onKeyDown: T.func,
		onKeyUp: T.func,
		onChange: T.func,
		onChangeSelection: T.func,

		modules: function(props) {
			var isNotObject = T.object.apply(this, arguments);
			if (isNotObject) return isNotObject;

			if (
				props.modules && 
				props.modules.toolbar &&
				props.modules.toolbar[0] &&
				props.modules.toolbar[0].type
			) return new Error(
				'Since v1.0.0, React Quill will not create a custom toolbar for you ' +
				'anymore. Create a toolbar explictly, or let Quill create one. ' +
				'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
			);
		},

		toolbar: function(props) {
			if ('toolbar' in props) return new Error(
				'The `toolbar` prop has been deprecated. Use `modules.toolbar` instead. ' +
				'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
			);
		},

		formats: function(props) {
			var isNotArrayOfString = T.arrayOf(T.string).apply(this, arguments);

			if (isNotArrayOfString) return new Error(
				'You cannot specify custom `formats` anymore. Use Parchment instead.  ' +
				'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
			);
		},

		styles: function(props) {
			if ('styles' in props) return new Error(
				'The `styles` prop has been deprecated. Use custom stylesheets instead. ' +
				'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
			);
		},

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
		'style',
		'modules',
		'formats',
		'bounds',
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
	whenever `value` is being sent in props.
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
			this.getEditorConfig()
		);
		this.setState({ editor:editor });
	},

	componentWillUnmount: function() {
		// NOTE: Don't set the state to null here
		//       as it would generate a loop.
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		// Rerender whenever a "dirtyProp" changes
		var props = this.props;
		return some(this.dirtyProps, function(prop) {
			return !isEqual(nextProps[prop], props[prop]);
		});
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
		return {
			bounds:       this.props.bounds,
			formats:      this.props.formats,
			modules:      this.props.modules,
			placeholder:  this.props.placeholder,
			readOnly:     this.props.readOnly,
			theme:        this.props.theme,
		};
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
	Renders an editor element, unless it has been provided one to clone.
	*/
	renderContents: function() {
		var contents = [];
		var children = React.Children.map(
			this.props.children,
			function(c) { return React.cloneElement(c, {ref: c.ref}); }
		);

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
			onKeyUp: this.props.onKeyUp },
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
	}

});

module.exports = QuillComponent;
