/* global React */
/* global ReactQuill */
'use strict';

if (typeof React !== 'object') alert('React not found. Did you run "npm install"?');
if (typeof ReactQuill !== 'function') alert('ReactQuill not found. Did you run "make build"?')

var EMPTY_DELTA = {ops: []};

var Editor = React.createClass({

	getInitialState: function() {
		return {
			theme: 'snow',
			enabled: true,
			readOnly: false,
			value: EMPTY_DELTA,
			events: []
		};
	},

	formatRange: function(range) {
		return range
			? [range.index, range.index + range.length].join(',')
			: 'none';
	},

	onEditorChange: function(value, delta, source, editor) {
		this.setState({
			value: editor.getContents(),
			events: [
				'text-change('+this.state.value+' -> '+value+')'
			].concat(this.state.events)
		});
	},

	onEditorChangeSelection: function(range, source) {
		this.setState({
			selection: range,
			events: [
				'selection-change('+
					this.formatRange(this.state.selection)
				+' -> '+
					this.formatRange(range)
				+')'
			].concat(this.state.events)
		});
	},

	onEditorFocus: function(range, source) {
		this.setState({
			events: [
				'focus('+this.formatRange(range)+')'
			].concat(this.state.events)
		});
	},

	onEditorBlur: function(previousRange, source) {
		this.setState({
			events: [
				'blur('+this.formatRange(previousRange)+')'
			].concat(this.state.events)
		});
	},

	onToggle: function() {
		this.setState({ enabled: !this.state.enabled });
	},

	onToggleReadOnly: function() {
		this.setState({ readOnly: !this.state.readOnly });
	},

	render: function() {
		return (
			React.DOM.div({},
				this.renderToolbar(),
				React.DOM.hr(),
				this.renderSidebar(),
				this.state.enabled && ReactQuill({
					theme: this.state.theme,
					value: this.state.value,
					readOnly: this.state.readOnly,
					onChange: this.onEditorChange,
					onChangeSelection: this.onEditorChangeSelection,
					onFocus: this.onEditorFocus,
					onBlur: this.onEditorBlur,
				})
			)
		);
	},

	renderToolbar: function() {
		var state = this.state;
		var enabled = state.enabled;
		var readOnly = state.readOnly;
		var selection = this.formatRange(state.selection);
		return (
			React.DOM.div({},
				React.DOM.button({
					onClick: this.onToggle },
					enabled? 'Disable' : 'Enable'
				),
				React.DOM.button({
					onClick: this.onToggleReadOnly },
					'Set ' + (readOnly? 'read/Write' : 'read-only')
				),
				React.DOM.button({
					disabled: true },
					'Selection: ('+selection+')'
				)
			)
		);
	},

	renderSidebar: function() {
		return (
			React.DOM.div({
				style: { overflow:'hidden', float:'right' }},
				React.DOM.textarea({
					style: { display:'block', width:300, height:300 },
					value: JSON.stringify(this.state.value, null, 2),
					readOnly: true
				}),
				React.DOM.textarea({
					style: { display:'block', width:300, height:300 },
					value: this.state.events.join('\n'),
					readOnly: true
				})
			)
		);
	}

});

Editor = React.createFactory(Editor);
ReactQuill = React.createFactory(ReactQuill);

ReactDOM.render(
	Editor(),
	document.getElementById('app')
);
