import * as React from "react";
import * as Quill from "quill";

type ToolbarOptionItem = string | string[] | Object[];

interface ToolbarOptionObject {
	container: string;
	handlers?: {
		[key: string]: Function;
	};
}

export interface Modules {
	/**
	 * @deprecated
	 * 'Since v1.0.0, React Quill will not create a custom toolbar for you anymore.
	 * Create a toolbar explictly, or let Quill create one.
	 * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100
	 */
	toolbar?: never;
}

export interface UnprivilegedEditor {
	getLength(): number;
    getText(index?: number, length?: number): string;
	getHTML(): string;
	getBounds(index: number, length?: number): Quill.BoundsStatic;
    getSelection(focus?: boolean): Quill.RangeStatic;
    getContents(index?: number, length?: number): DeltaStatic;}

export interface ComponentProps {
	id?: string;
	className?: string;
	theme?: string;
	style?: React.CSSProperties;
	readOnly?: boolean;
	value?: string | Quill.Delta;
	defaultValue?: string | Quill.Delta;
	placeholder?: string;
	tabIndex?: number;
	bounds?: string | HTMLElement;
	onChange?: (content: string, delta: Quill.Delta, source: Quill.Sources, editor: UnprivilegedEditor) => void;
	onChangeSelection?: (range: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor) => void;
	onFocus?: (range: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor) => void;
	onBlur?: (previousRange: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor) => void;
	onKeyPress?: React.EventHandler<any>;
	onKeyDown?: React.EventHandler<any>;
	onKeyUp?: React.EventHandler<any>;
	formats?: string[];
	children?: React.ReactElement<any>;
	modules?: Modules;

	/** @deprecated
	 * The `toolbar` prop has been deprecated. Use `modules.toolbar` instead.
	 * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.
	 * */

	toolbar?: never;
	/** @deprecated
	 * The `styles` prop has been deprecated. Use custom stylesheets instead.
	 * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100
	 */

	 styles?: never;
	/**
	 * @deprecated
	 * The `pollInterval` property does not have any effect anymore.
	 * You can safely remove it from your props.
	 * See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.
	 */
	pollInterval?: never;
}

export default class Component extends React.Component<ComponentProps> {
	focus(): void;
	blur(): void;
	getEditor(): Quill.Quill;
}

export interface ToolbarItem {
	type: string;
	label?: string;
	value?: string;
	items?: ToolbarItem[];
}

export interface ToolbarProps {
	id?: string;
	className?: string;
	style?: Object;
	items?: ToolbarItem[];
}

export class Toolbar extends React.Component<ToolbarProps> {}

export interface Mixin {
	createEditor(element: HTMLElement, config: Quill.QuillOptionsStatic): Quill.Quill;
	hookEditor(editor: Quill.Quill): void;
	unhookEditor(editor: Quill.Quill): void;
	setEditorReadOnly(editor: Quill.Quill, value: boolean);
	setEditorContents(editor: Quill.Quill, value: Quill.Delta | string);
	setEditorSelection(editor: Quill.Quill, range: Quill.RangeStatic);
	makeUnprivilegedEditor(editor: Quill.Quill): UnprivilegedEditor;
}
