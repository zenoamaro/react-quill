'use strict';

var React = require('react'),
	QuillToolbar = require('./toolbar'),
	QuillMixin = require('./mixin'),
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
		id: T.string,
		className: T.string,
		style: T.object,
		value: T.string,
		defaultValue: T.string,
		readOnly: T.bool,
		toolbar: T.array,
		formats: T.array,
		styles: T.object,
		theme: T.string,
		pollInterval: T.number,
		onChange: T.func,
		onChangeSelection: T.func
	},

	/*
	Changing one of these props should cause a re-render.
	*/
	dirtyProps: [
		'id',
		'className',
		'toolbar',
		'formats',
		'styles',
		'theme',
		'pollInterval'
	],

	getDefaultProps: function() {
		return {
			className: '',
			theme: 'base',
			modules: {
				'link-tooltip': true
			}
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
		// Check if one of the changes should trigger a re-render.
		for (var i=0; i<this.dirtyProps.length; i++) {
			var prop = this.dirtyProps[i];
			if (nextProps[prop] !== this.props[prop]) {
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
		if (React.Children.count(this.props.children)) {
			return this.props.children;
		} else {
			return [
				// Quill modifies these elements in-place,
				// so we need to re-render them every time.
				QuillToolbar({
					key: 'toolbar-' + Math.random(),
					ref: 'toolbar',
					items: this.props.toolbar
				}),
				React.DOM.div({
					key: 'editor-' + Math.random(),
					ref: 'editor',
					className: 'quill-contents',
					dangerouslySetInnerHTML: { __html:this.getEditorContents() }
				})
			];
		}
	},

	render: function() {
		return React.DOM.div({
			id: this.props.id,
			style: this.props.style,
			className: 'quill ' + this.props.className,
			onChange: this.preventDefault },
			this.renderContents()
		);
	},

	onEditorChange: function(value, delta, source) {
		if (value !== this.getEditorContents()) {
			this.setState({ value: value });
			if (this.props.onChange) {
				this.props.onChange(value, delta, source);
			}
		}
	},

	onEditorChangeSelection: function(range, source) {
		var s = this.getEditorSelection() || {};
		var r = range || {};
		if (r.start !== s.start || r.end !== s.end) {
			this.setState({ selection: range });
			if (this.props.onChangeSelection) {
				this.props.onChangeSelection(range, source);
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
