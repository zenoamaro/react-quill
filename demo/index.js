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
				ReactQuill({
					theme: 'snow',
					defaultValue: this.state.value,
					onChange: this.onEditorChange
				})
			)
		);
	}

});

// Support React 0.11 and 0.12
// FIXME: Remove with React 0.13
if (React.createFactory) {
	Editor = React.createFactory(Editor);
	ReactQuill = React.createFactory(ReactQuill);
}

// Support React 0.11 and 0.12
// FIXME: Remove with React 0.13
(React.render||React.renderComponent)(
	Editor(),
	document.body
);
