/*
QuillToolbar is deprecated. Consider switching to the official Quill
toolbar format, or providing your own toolbar instead.
See https://quilljs.com/docs/modules/toolbar
*/

import React, {CSSProperties} from 'react';
import ReactDOMServer from 'react-dom/server';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

const defaultColors = [
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

const defaultItems = [
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

export interface ReactQuillToolbarProps {
	className?: string,
	items?: ToolbarItem[],
	id?: string,
	style?: CSSProperties,
}

export type ToolbarItem = (
	ToolbarGroup |
	ToolbarChoice |
	ToolbarButton |
	ToolbarAction
);

export interface ToolbarGroup {
	type: 'group',
	label: string,
	items: ToolbarItem[],
}

export interface ToolbarChoiceItem {
	label: string,
	value: string,
	selected: boolean,
}

export interface ToolbarChoice {
	type: 'font'|'header'|'align'|'size'|'color'|'background',
	label: string,
	items: ToolbarChoiceItem[],
}

export interface ToolbarButton {
	type: (
		'bold'|'italic'|'underline'|'strike'|'link'| 'list'|'bullet'|'ordered'|
		'indent'|'image'|'video'
	),
	label: string,
	value: string,
	children: React.ReactNode,
}

export interface ToolbarAction {
	type: 'action',
	label: string,
	value: string,
	children: React.ReactNode,
}

export default class ReactQuillToolbar extends React.Component<
	ReactQuillToolbarProps
> {

	static displayName = 'React Quill Toolbar'

	static defaultProps = {
		items: defaultItems,
	}

	static defaultItems = defaultItems
	static defaultColors = defaultColors

	constructor(props: ReactQuillToolbarProps) {
		super(props);

		console.warn(
			'QuillToolbar is deprecated. Consider switching to the official Quill ' +
			'toolbar format, or providing your own toolbar instead. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0'
		);
	}

	shouldComponentUpdate(nextProps: ReactQuillToolbarProps) {
		return !isEqual(nextProps, this.props);
	}

	renderGroup = (item: ToolbarGroup, key: number): JSX.Element => {
		return (
			<span
				key={item.label ?? key}
				className="ql-formats"
			>
				{item.items.map(this.renderItem)}
			</span>
		);
	}

	renderChoiceItem = (item: ToolbarChoiceItem, key: number): JSX.Element => {
		return (
			<option
				key={item.label ?? item.value ?? key}
				value={item.value}
			>
				{item.label}
			</option>
		);
	}

	renderChoices = (item: ToolbarChoice, key: number): JSX.Element => {
		const choiceItems = item.items.map(this.renderChoiceItem);
		const selectedItem = find(item.items, item => item.selected);
		return (
			<select
				key={item.label ?? key}
				title={item.label}
				className={`ql-${item.type}`}
				value={selectedItem?.value}
			>
				{choiceItems}
			</select>
		);
	}

	renderButton = (item: ToolbarButton, key: number): JSX.Element => {
		return (
			<button
				type={'button'}
				key={item.label ?? item.value ?? key}
				value={item.value}
				className={`ql-${item.type}`}
				title={item.label}
			>
				{item.children}
			</button>
		);
	}

	renderAction = (item: ToolbarAction, key: number): JSX.Element => {
		return (
			<button
				key={item.label ?? item.value ?? key}
				className={`ql-${item.type}`}
				title={item.label}
			>
				{item.children}
			</button>
		);
	}

	renderItem = (item: ToolbarItem, key: number): JSX.Element => {
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
		return `quill-toolbar ${this.props.className??''}`;
	}

	render() {
		const {id, style, items=[]} = this.props;
		const children = items.map(this.renderItem);
		const html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
		return (
			<div
				id={id}
				className={this.getClassName()}
				style={style}
				dangerouslySetInnerHTML={{__html:html}}
			/>
		);
	}

}
