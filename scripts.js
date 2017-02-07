/* global React */
/* global ReactDOM */
/* global ReactQuill */
/* global Prism */
/* global html_beautify */
'use strict';


var defaultContent = (
	'<div><span style="font-size: 18px;">Quill Rich Text Editor</span>'+
	'</div><div><br></div><div>Quill is a free, <a href="https://githu'+
	'b.com/quilljs/quill/">open source</a> WYSIWYG editor built for th'+
	'e modern web. With its <a href="http://quilljs.com/docs/modules/"'+
	'>extensible architecture</a> and a <a href="http://quilljs.com/do'+
	'cs/api/">expressive API</a> you can completely customize it to fu'+
	'lfill your needs. Some built in features include:</div><div><br><'+
	'/div><ul><li>Fast and lightweight</li><li>Semantic markup</li><li'+
	'>Standardized HTML between browsers</li><li>Cross browser support'+
	' including Chrome, Firefox, Safari, and IE 9+</li></ul><div><br><'+
	'/div><div><span style="font-size: 18px;">Downloads</span></div><d'+
	'iv><br></div><ul><li><a href="https://quilljs.com">Quill.js</a>, '+
	'the free, open source WYSIWYG editor</li><li><a href="https://zen'+
	'oamaro.github.io/react-quill">React-quill</a>, a React component '+
	'that wraps Quill.js</li></ul>'
);


var defaultColors = ReactQuill.Toolbar.defaultColors;

/*
This is slightly more than the regular configuration,
and is here to allow a sneak peek on what's configurable.
*/
var modules = {
	syntax: true,
	toolbar: [
		[{ font: [] }, { size: [] }],
		[{ align: [] }, 'direction' ],
		[ 'bold', 'italic', 'underline', 'strike' ],
		[{ color: [] }, { background: [] }],
		[{ script: 'super' }, { script: 'sub' }],
		['blockquote', 'code-block' ],
		[{ list: 'ordered' }, { list: 'bullet'}, { indent: '-1' }, { indent: '+1' }],
		[ 'link', 'image', 'video' ],
		[ 'clean' ]
	],
};
 

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
					modules: modules,
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


// FIXME: Remove with the switch to JSX
Editor = React.createFactory(Editor);
ReactQuill = React.createFactory(ReactQuill);

ReactDOM.render(
	Editor(),
	document.body
);
