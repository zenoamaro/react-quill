import * as React from "react";
import * as Quill from "quill";

type ToolbarOptionItem = string | string[] | Object[];

interface ToolbarOptionObject {
    container: string;
    handlers?: {
        [key: string]: Function;
    };
}

export interface QuillModules {
    toolbar: string | ToolbarOptionObject | ToolbarOptionItem[];
}

export interface UnprivilegedEditor {
    getLength: () => number;
    getText: () => string;
    getHTML: () => string;
    getBounds(index: number, length?: number): Quill.BoundsStatic;
    getSelection(focus?: boolean): Quill.RangeStatic;
}

export interface QuillComponentProps {
    id: string;
    className: string;
    theme: string;
    style: React.CSSProperties;
    readOnly: boolean;
    value: string | Quill.Delta;
    defaultValue: string | Quill.Delta;
    placeholder: string;
    tabIndex: number;
    bounds: string | HTMLElement;
    onChange(content: string, delta: Quill.Delta, source: Quill.Sources, editor: UnprivilegedEditor): void;
    onChangeSelection(range: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor): void;
    onFocus(range: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor): void;
    onBlur(previousRange: Quill.RangeStatic, source: Quill.Sources, editor: UnprivilegedEditor): void;
    onKeyPress: React.EventHandler<any>;
    onKeyDown: React.EventHandler<any>;
    onKeyUp: React.EventHandler<any>;
    modules: QuillModules;
    // toolbar: never;
    formats: string[];
    // styles: never;
    // pollInterval: never;
    children: React.ReactElement<any>;
}

export default class QuillComponent extends React.Component<QuillComponentProps> {
    focus(): void;
    blur(): void;
    getEditor(): Quill.Quill;
}

export interface QuillToolbarItems {}

export interface QuillToolbarProps {
    id: string;
    className: string;
    style: Object;
    items: any[];
}

export class QuillToolbar extends React.Component<QuillToolbarProps> {}

export interface QuillMixin {
    createEditor(element: HTMLElement, config: Quill.QuillOptionsStatic): Quill.Quill;
    hookEditor(editor: Quill.Quill): void;
    unhookEditor(editor: Quill.Quill): void;
    setEditorReadOnly(editor: Quill.Quill, value: boolean);
    setEditorContents(editor: Quill.Quill, value: Quill.Delta | string);
    setEditorSelection(editor: Quill.Quill, range: Quill.RangeStatic);
    makeUnprivilegedEditor(editor: Quill.Quill): UnprivilegedEditor;
}
