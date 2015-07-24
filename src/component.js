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
		id:                T.string,
		className:         T.string,
		value:             T.string,
		defaultValue:      T.string,
		readOnly:          T.bool,
		hideToolbar:       T.bool,
		toolbar:           T.array,
		placeholder:       T.string,
		formats:           T.array,
		styles:            T.object,
		theme:             T.string,
		pollInterval:      T.number,
		onChange:          T.func,
		onSelectionChange: T.func
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
		return {focused: false};
	},

	/*
	Update only if we've been passed a new `value`.
	This leaves components using `defaultValue` alone.
	*/
	componentWillReceiveProps: function(nextProps) {
		if ('value' in nextProps) {
			if (nextProps.value !== this.props.value) {
				this.setEditorContents(this.editor, nextProps.value);
			}
		}
	},

	componentDidMount: function() {
		var editor = this.createEditor(
			this.getEditorElement(),
			this.getEditorConfig());
		this.setState({ editor:editor });
		this.editor = editor;

		editor.on('selection-change', this.onSelectionChange);

		this.toggleToolbar();
		if (this.props.placeholder && !this.props.value && !this.props.defaultValue) {
			this.setPlaceholder();
		}
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

	getEditor: function() {
	  return this.editor;
	},

	isEmpty: function() {
		var editor = this.getEditor();
		var length = editor.getLength();
		var placeholder = this.props.placeholder;
		if (placeholder) {
			var text = editor.getText();
			return text === '\n' || text === (placeholder + '\n');
		} else {
			return length === 1;
		}
	},

	setPlaceholder: function() {
	  this.getEditor().setText(this.props.placeholder);
	},

	removePlaceholder: function() {
	  this.getEditor().setText('');
	},

	onSelectionChange: function(range) {
		if (this.props.placeholder && this.isEmpty()) {
			if (range) {
				this.removePlaceholder();
			} else {
				this.setPlaceholder();
			}
		}

		this.setState({focused: Boolean(range)});
		this.toggleToolbar();

		if (this.props.onSelectionChange) {
			this.props.onSelectionChange(range);
		}
	},

	toggleToolbar: function() {
		if (this.props.hideToolbar) {
			this.refs.toolbar.getDOMNode().style.display = this.state.focused ?
				'block' : 'none';
		}
	},

	render: function() {
		return React.DOM.div({
			className: this.getClassName(),
			onChange: this.preventDefault },
			[
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
			]
		);
	},

	/*
	Updates the local state with the new contents,
	executes the change handler passed as props.
	*/
	onEditorChange: function(value, delta, source) {
		if (value !== this.state.value) {
			if (this.isEmpty()) {
				value = '';
			}
			if (this.props.onChange) {
				this.props.onChange(value, delta, source);
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
