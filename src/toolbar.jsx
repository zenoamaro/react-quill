/*
QuillToolbar is deprecated. Consider switching to the official Quill
toolbar format, or providing your own toolbar instead.
See https://quilljs.com/docs/modules/toolbar
*/

import React from 'react';
import isEqual from 'lodash/isEqual';

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

export default class Toolbar extends React.Component {

	static displayName = 'React Quill Toolbar'

	static defaultProps = {
		items: defaultItems
	}

	static defaultItems = defaultItems
	static defaultColors = defaultColors

	constructor(props) {
		super(props);
		console.warn(
			'QuillToolbar is deprecated. Consider switching to the official Quill ' +
			'toolbar format, or providing your own toolbar instead. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextProps, this.props);
	}

	renderGroup = (item, key) => {
		return (
			<span
				key={item.label || key}
				className={'ql-formats'}
			>
				{item.items.map(this.renderItem)}
			</span>
		);
	}

	renderChoiceItem = (item, key) => {
		return (
			<option
				key={item.label || item.value || key}
				value={item.valu}
			>
				{item.label}
			</option>
		);
	}

	renderChoices = (item, key) => {
		var choiceItems = item.items.map(this.renderChoiceItem);
		var selectedItem = find(item.items, function(item){ return item.selected });
		return (
			<select
				key={item.label || key}
				title={item.label}
				className={'ql-'+item.type}
				value={selectedItem.value}
			>
				{choiceItems}
			</select>
		);
	}

	renderButton = (item, key) => {
		return (
			<button
				type={'button'}
				key={item.label || item.value || key}
				value={item.value}
				className={'ql-'+item.type}
				title={item.label}
			>
				{item.children}
			</button>
		);
	}

	renderAction = (item, key) => {
		return (
			<button
				key={item.label || item.value || key}
				className={'ql-'+item.type}
				title={item.label}
			>
				{item.children}
			</button>
		);
	}

	renderItem = (item, key) => {
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
	}

	getClassName() {
		return 'quill-toolbar ' + (this.props.className||'');
	}

	render() {
		var children = this.props.items.map(this.renderItem);
		var html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
		return (
			<div
				id={this.props.id}
				className={this.getClassName()}
				style={this.props.style}
				dangerouslySetInnerHTML={{ __html:html }}
			/>
		);
	}

}
