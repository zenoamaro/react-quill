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