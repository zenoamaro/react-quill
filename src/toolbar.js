/*
QuillToolbar is deprecated. Consider switching to the official Quill
toolbar format, or providing your own toolbar instead. 
See https://quilljs.com/docs/modules/toolbar
*/

'use strict';

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var find = require('lodash/find');
var isEqual = require('lodash/isEqual');
var T = React.PropTypes;

var defaultColors = [
	'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
	'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
	'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
	'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
	'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
	'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
	'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
	'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
	'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
	'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
	'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
	'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
].map(function(color){ return { value: color } });

var defaultItems = [

	{ label:'Formats', type:'group', items: [
		{ label:'Font', type:'font', items: [
			{ label:'Sans Serif',  value:'sans-serif', selected:true },
			{ label:'Serif',       value:'serif' },
			{ label:'Monospace',   value:'monospace' }
		]},
		{ label:'Size', type:'size', items: [
			{ label:'Small',  value:'10px' },
			{ label:'Normal', value:'13px', selected:true },
			{ label:'Large',  value:'18px' },
			{ label:'Huge',   value:'32px' }
		]},
		{ label:'Alignment', type:'align', items: [
			{ label:'', value:'', selected:true },
			{ label:'', value:'center' },
			{ label:'', value:'right' },
			{ label:'', value:'justify' }
		]}
	]},

	{ label:'Text', type:'group', items: [
		{ type:'bold', label:'Bold' },
		{ type:'italic', label:'Italic' },
		{ type:'strike', label:'Strike' },
		{ type:'underline', label:'Underline' },
		{ type:'color', label:'Color', items:defaultColors },
		{ type:'background', label:'Background color', items:defaultColors },
		{ type:'link', label:'Link' }
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'list', value:'bullet' },
		{ type:'list', value:'ordered' }
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'image', label:'Image' }
	]}

];

var QuillToolbar = React.createClass({

	displayName: 'Quill Toolbar',

	propTypes: {
		id:        T.string,
		className: T.string,
		style:     T.object,
		items:     T.array
	},

	getDefaultProps: function() {
		return {
			items: defaultItems
		};
	},

	componentDidMount: function() {
		console.warn(
			'QuillToolbar is deprecated. Consider switching to the official Quill ' +
			'toolbar format, or providing your own toolbar instead. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
		);
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return !isEqual(nextProps, this.props);
	},

	renderGroup: function(item, key) {
		return React.DOM.span({
			key: item.label || key,
			className:'ql-formats' },
			item.items.map(this.renderItem)
		);
	},

	renderChoiceItem: function(item, key) {
		return React.DOM.option({
			key: item.label || item.value || key,
			value: item.value },
			item.label
		);
	},

	renderChoices: function(item, key) {
		var choiceItems = item.items.map(renderChoiceItem);
		var selectedItem = find(item.items, function(item){ return item.selected });
		var attrs = {
			key: item.label || key,
			title: item.label,
			className: 'ql-'+item.type,
			value: selectedItem.value,
		};
		return React.DOM.select(attrs, choiceItems);
	},

	renderButton: function(item, key) {
		return React.DOM.button({
			type: 'button',
			key: item.label || item.value || key,
			value: item.value,
			className: 'ql-'+item.type,
			title: item.label },
			item.children
		);
	},

	renderAction: function(item, key) {
		return React.DOM.button({
			key: item.label || item.value || key,
			className: 'ql-'+item.type,
			title: item.label },
			item.children
		);
	},

	renderItem: function(item, key) {
		switch (item.type) {
			case 'group':
				return this.renderGroup(item, key);
			case 'font':
			case 'header':
			case 'align':
			case 'size':
			case 'color':
			case 'background':
				return this.renderChoices(item, key);
			case 'bold':
			case 'italic':
			case 'underline':
			case 'strike':
			case 'link':
			case 'list':
			case 'bullet':
			case 'ordered':
			case 'indent':
			case 'image':
			case 'video':
				return this.renderButton(item, key);
			default:
				return this.renderAction(item, key);
		}
	},

	getClassName: function() {
		return 'quill-toolbar ' + (this.props.className||'');
	},

	render: function() {
		var children = this.props.items.map(this.renderItem);
		var html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
		return React.DOM.div({
			id: this.props.id,
			className: this.getClassName(),
			style: this.props.style,
			dangerouslySetInnerHTML: { __html:html }
		});
	},

});

module.exports = QuillToolbar;
QuillToolbar.defaultItems = defaultItems;
QuillToolbar.defaultColors = defaultColors;
