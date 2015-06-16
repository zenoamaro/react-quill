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

	onReset: function() {
		this.setState({ enabled: !this.state.enabled });
	},

	render: function() {
		var quillComponent;
		if (this.state.enabled) {
			quillComponent = ReactQuill({
				theme: 'snow',
				value: this.state.value,
				onChange: this.onEditorChange
			});
		}
		return (
			React.DOM.div({},
				React.DOM.button({
					onClick: this.onReset },
					'Reset'
				),
				React.DOM.textarea({
					value: this.state.value,
					onChange: this.onTextareaChange
				}),
				quillComponent
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
