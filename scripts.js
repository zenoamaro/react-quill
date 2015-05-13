/* global React */
/* global ReactQuill */
/* global Prism */
/* global html_beautify */
'use strict';


var defaultContent = '\
	<div><span style="font-size: 18px;">Quill Rich Text Editor</span></div>\
	<div><br></div>\
	<div>\
		<span>Quill is a free, </span>\
		<a href="https://github.com/quilljs/quill/">open source</a>\
		<span> WYSIWYG editor built for the modern web. With its </span>\
		<a href="http://quilljs.com/docs/modules/">extensible architecture</a>\
		<span> and a </span>\
		<a href="http://quilljs.com/docs/api/">expressive API</a>\
		<span> you can completely customize it to fulfill your needs. Some built in features include:</span>\
	</div>\
	<div><br></div>\
	<ul>\
		<li>Fast and lightweight</li>\
		<li>Semantic markup</li>\
		<li>Standardized HTML between browsers</li>\
		<li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li>\
	</ul>\
	<div><br></div>\
	<div><span style="font-size: 18px;">Downloads</span></div>\
	<div><br></div>\
	<ul>\
		<li><a href="https://quilljs.com">Quill.js</a>, the free, open source WYSIWYG editor</li>\
		<li><a href="https://zenoamaro.github.io/react-quill">React-quill</a>, a React component that wraps Quill.js</li>\
	</ul>\
';


var defaultColors = ReactQuill.Toolbar.defaultColors;

/*
This is the same as the default toolbar configuration,
and is here just to allow a sneak peek on what's configurable.
*/
var toolbarItems = [

	{ label:'Formats', type:'group', items: [
		{ label:'Font', type:'font', items: [
			{ label:'Sans Serif',  value:'sans-serif' },
			{ label:'Serif',       value:'serif' },
			{ label:'Monospace',   value:'monospace' }
		]},
		{ type:'separator' },
		{ label:'Size', type:'size', items: [
			{ label:'Normal',  value:'10px' },
			{ label:'Smaller', value:'13px' },
			{ label:'Larger',  value:'18px' },
			{ label:'Huge',    value:'32px' }
		]},
		{ type:'separator' },
		{ label:'Alignment', type:'align', items: [
			{ label:'', value:'center' },
			{ label:'', value:'left' },
			{ label:'', value:'right' },
			{ label:'', value:'justify' }
		]}
	]},

	{ label:'Text', type:'group', items: [
		{ type:'bold', label:'Bold' },
		{ type:'italic', label:'Italic' },
		{ type:'strike', label:'Strike' },
		{ type:'underline', label:'Underline' },
		{ type:'separator' },
		{ type:'color', label:'Color', items:defaultColors },
		{ type:'background', label:'Background color', items:defaultColors }
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'bullet', label:'Bullet' },
		{ type:'separator' },
		{ type:'list', label:'List' }
	]}

];


/*
A simple editor component, with a real-time preview
of the generated HTML content.
*/
var Editor = React.createClass({

	getInitialState: function() {
		return {
			value: defaultContent
		};
	},

	onEditorChange: function(value) {
		this.setState({ value:value });
	},

	tidyHtml: function(source) {
		return html_beautify(source, {
			unformatted: [],
			preserve_newlines: false,
		});
	},

	componentDidUpdate: function() {
		Prism.highlightAll();
	},

	render: function() {
		return (
			React.DOM.div({ className: 'app' },
				// The editor
				ReactQuill({
					className: 'editor',
					theme: 'snow',
					toolbar: toolbarItems,
					value: this.state.value,
					onChange: this.onEditorChange
				}),
				// The preview pane
				React.DOM.pre({ className:'preview' },
					React.DOM.code({ className:'language-markup'},
						this.tidyHtml(this.state.value)
					)
				)
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
