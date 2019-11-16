import Quill, {
	QuillOptionsStatic,
	DeltaStatic,
	BoundsStatic,
	RangeStatic,
	Sources as QuillSources,
} from 'quill';

export interface QuillOptions extends QuillOptionsStatic {
	tabIndex?: number,
}

export interface ReactQuillMixin {
	createEditor(element: Element, config: QuillOptions): Quill,
	hookEditor(editor: Quill): void,
	unhookEditor(editor: Quill): void,
	setEditorReadOnly(editor: Quill, value: boolean): void,
	setEditorContents(editor: Quill, value: string | DeltaStatic): void,
	setEditorSelection(editor: Quill, range: RangeStatic | null): void,
	setEditorTabIndex(editor: Quill, tabIndex: number): void,
	makeUnprivilegedEditor(editor: Quill): UnprivilegedEditor,
	handleChange?(eventType: string, rangeOrDelta: RangeStatic | DeltaStatic | null, oldRangeOrOldDelta: RangeStatic | DeltaStatic | null, source: QuillSources): void,
	onEditorChangeText?(value: string, delta: DeltaStatic, source: QuillSources, editor: UnprivilegedEditor): void;
	onEditorChangeSelection?(selection: RangeStatic | null, source: QuillSources, editor: UnprivilegedEditor): void;
}

export interface UnprivilegedEditor {
	getLength(): number;
	getText(index?: number, length?: number): string;
	getHTML(): string;
	getBounds(index: number, length?: number): BoundsStatic;
	getSelection(focus?: boolean): RangeStatic;
	getContents(index?: number, length?: number): DeltaStatic;
}

const Mixin: ReactQuillMixin = {

	/**
	Creates an editor on the given element. The editor will
	be passed the configuration, have its events bound,
	*/
	createEditor: function(element, config) {
		const editor = new Quill(element, config);
		if (config.tabIndex != null) {
			this.setEditorTabIndex(editor, config.tabIndex);
		}
		this.hookEditor(editor);
		return editor;
	},

	hookEditor: function(editor) {
		// Expose the editor on change events via a weaker, unprivileged proxy
		// object that does not allow accidentally modifying editor state.
		const unprivilegedEditor = this.makeUnprivilegedEditor(editor);

		this.handleChange = (eventType, rangeOrDelta, _, source) => {
			if (eventType === 'text-change') {
				this.onEditorChangeText?.(
					editor.root.innerHTML, rangeOrDelta as DeltaStatic, source,
					unprivilegedEditor
				);
				this.onEditorChangeSelection?.(
					editor.getSelection(), source,
					unprivilegedEditor
				);
			}
			if (eventType === 'selection-change') {
				this.onEditorChangeSelection?.(
					rangeOrDelta as RangeStatic, source,
					unprivilegedEditor
				);
			}
		};

		editor.on('editor-change', this.handleChange);
	},

	unhookEditor: function(editor) {
		if (this.handleChange) {
			editor.off('editor-change', this.handleChange);
		}
	},

	setEditorReadOnly: function(editor, value) {
		value? editor.disable()
		     : editor.enable();
	},

	/*
	Replace the contents of the editor, but keep
	the previous selection hanging around so that
	the cursor won't move.
	*/
	setEditorContents: function(editor, value) {
		const sel = editor.getSelection();

		if (typeof value === 'string') {
			editor.setContents(editor.clipboard.convert(value));
		} else {
			editor.setContents(value);
		}

		if (sel && editor.hasFocus()) this.setEditorSelection(editor, sel);
	},

	setEditorSelection: function(editor, range) {
		if (range) {
			// Validate bounds before applying.
			const length = editor.getLength();
			range.index = Math.max(0, Math.min(range.index, length-1));
			range.length = Math.max(0, Math.min(range.length, (length-1) - range.index));
		}
		// Quill type erroneously does not accept null
		editor.setSelection(range!);
	},

	setEditorTabIndex: function(editor, tabIndex) {
		if (editor?.scroll?.domNode) {
			(editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
		}
	},

	/*
	Returns a weaker, unprivileged proxy object that only exposes read-only
	accessors found on the editor instance, without any state-modifying methods.
	*/
	makeUnprivilegedEditor: function(editor) {
		const e = editor;
		return {
			getHTML:      () => e.root.innerHTML,
			getLength:    e.getLength.bind(e),
			getText:      e.getText.bind(e),
			getContents:  e.getContents.bind(e),
			getSelection: e.getSelection.bind(e),
			getBounds:    e.getBounds.bind(e),
		};
	}

};

export default Mixin;
