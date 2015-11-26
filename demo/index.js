/* global React */
/* global ReactQuill */
'use strict';

var Editor = React.createClass({

	getInitialState: function() {
		return {
			theme: 'snow',
			enabled: true,
			readOnly: false,
			value: '<h1>It works!</h1>',
			events: []
		};
	},

	formatRange: function(range) {
		return range
			? [range.start, range.end].join(',')
			: 'none';
	},

	onTextareaChange: function(event) {
		var value = event.target.value;
		this.setState({ value:value });
	},

	onEditorChange: function(value, delta, source) {
		this.setState({
			value: value,
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
					onChangeSelection: this.onEditorChangeSelection
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
					value: this.state.value,
					onChange: this.onTextareaChange
				}),
				React.DOM.textarea({
					style: { display:'block', width:300, height:300 },
					value: this.state.events.join('\n')
				})
			)
		);
	}

});

Editor = React.createFactory(Editor);
ReactQuill = React.createFactory(ReactQuill);

(ReactDOM.render)(
	Editor(),
	document.getElementById('app_container')
);
