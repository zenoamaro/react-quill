'use strict';

var React = require('react'),
	T = React.PropTypes;

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
		{ type:'link', label:'Link' }
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
		var mapping = {
			'group': this.renderGroup,
			'align': this.renderChoices,
			'size': this.renderChoices,
			'action': this.renderAction
		};
		var renderer = mapping[item.type] || mapping.action;
		return renderer(item);
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