/* global React */
/* global ReactQuill */
'use strict';

var Editor = React.createClass({

	getInitialState: function() {
		return {
			value: '<h1>It works!</h1>'
		};
	},

	onTextareaChange: function(event) {
		var value = event.target.value;
		this.setState({ value:value });
	},

	onEditorChange: function(value) {
		this.setState({ value:value });
	},

	render: function() {
		return (
			React.DOM.div({},
				React.DOM.textarea({
					value: this.state.value,
					onChange: this.onTextareaChange
				}),
				this.transferPropsTo(
					ReactQuill({
						theme: 'snow',
						defaultValue: this.state.value,
						onChange: this.onEditorChange
					})
				)
			)
		);
	}

});

React.renderComponent(
	Editor(),
	document.body
);