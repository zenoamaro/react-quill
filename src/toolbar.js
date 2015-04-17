'use strict';

var React = require('react'),
	T = React.PropTypes;

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
		{ label:'Size', type:'size', items: [
			{ label:'Normal', value:'' },
			{ label:'Smaller', value:'0.8em' },
			{ label:'Larger', value:'1.4em' },
			{ label:'Huge', value:'2em' }
		]},
		{ label:'Alignment', type:'align', items: [
			{ label:'Center', value:'center' },
			{ label:'Left', value:'left' },
			{ label:'Right', value:'right' },
			{ label:'Justify', value:'justify' }
		]}
	]},

	{ label:'Text', type:'group', items: [
		{ type:'bold', label:'Bold' },
		{ type:'italic', label:'Italic' },
		{ type:'strike', label:'Strike' },
		{ type:'underline', label:'Underline' },
		{ type:'link', label:'Link' },
		{ type:'color', label:'Color', items:defaultColors },
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'bullet', label:'Bullet' },
		{ type:'list', label:'List' }
	]}

];

var QuillToolbar = React.createClass({

	displayName: 'Quill Toolbar',

	propTypes: {
		id:        T.string,
		className: T.string,
		items:     T.array
	},

	getDefaultProps: function(){
		return {
			items: defaultItems
		};
	},

	renderGroup: function(item) {
		return React.DOM.span({
			key: item.label,
			className:'ql-format-group' },
			item.items.map(this.renderItem)
		);
	},

	renderChoiceItem: function(item) {
		return React.DOM.option({
			key: item.label || item.value,
			value:item.value },
			item.label
		);
	},

	renderChoices: function(item) {
		return React.DOM.select({
			key: item.label,
			className: 'ql-'+item.type },
			item.items.map(this.renderChoiceItem)
		);
	},

	renderAction: function(item) {
		return React.DOM.span({
			key: item.label || item.value,
			className: 'ql-format-button ql-'+item.type,
			title: item.label }
		);
	},

	renderItem: function(item) {
		switch (item.type) {
			case 'group':
				return this.renderGroup(item);
			case 'align':
			case 'size':
			case 'color':
			case 'background':
				return this.renderChoices(item);
			default:
				return this.renderAction(item);
		}
	},

	getClassName: function() {
		return 'quill-toolbar ' + (this.props.className||'');
	},

	render: function() {
		return React.DOM.div({
			className: this.getClassName() },
			this.props.items.map(this.renderItem)
		);
	}

});

module.exports = QuillToolbar;
QuillToolbar.defaultItems = defaultItems;
QuillToolbar.defaultColors = defaultColors;