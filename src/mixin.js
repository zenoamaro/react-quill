'use strict';

var Quill = require('quill');

var QuillMixin = {

	/**
	Creates an editor on the given element. The editor will
	be passed the configuration, have its events bound,
	*/
	createEditor: function($el, config) {
		var editor = new Quill($el, config);
		if (config.tabIndex !== undefined) {
			this.setEditorTabIndex(editor, config.tabIndex);
		}
		this.hookEditor(editor);
		return editor;
	},

	hookEditor: function(editor) {
		// Expose the editor on change events via a weaker,
		// unprivileged proxy object that does not allow
		// accidentally modifying editor state.
		var unprivilegedEditor = this.makeUnprivilegedEditor(editor);

		this.handleTextChange = function(delta, oldDelta, source) {
			if (this.onEditorChangeText) {
				this.onEditorChangeText(
					editor.root.innerHTML, delta, source,
					unprivilegedEditor
				);
				this.onEditorChangeSelection(
					editor.getSelection(), source,
					unprivilegedEditor
				);
			}
		}.bind(this);

		this.handleSelectionChange = function(range, oldRange, source) {
			if (this.onEditorChangeSelection) {
				this.onEditorChangeSelection(
					range, source,
					unprivilegedEditor
				);
			}
		}.bind(this);

		editor.on('editor-change', function(eventType, rangeOrDelta, oldRangeOrOldDelta, source) {
			if (eventType === Quill.events.SELECTION_CHANGE) {
				this.handleSelectionChange(rangeOrDelta, oldRangeOrOldDelta, source);
			}
			
			if (eventType === Quill.events.TEXT_CHANGE) {
				this.handleTextChange(rangeOrDelta, oldRangeOrOldDelta, source);
			}
		}.bind(this));
	},

	unhookEditor: function(editor) {
		editor.off('selection-change');
		editor.off('text-change');
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
		var sel = editor.getSelection();

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
			var length = editor.getLength();
			range.index = Math.max(0, Math.min(range.index, length-1));
			range.length = Math.max(0, Math.min(range.length, (length-1) - range.index));
		}
		editor.setSelection(range);
	},

	setEditorTabIndex: function(editor, tabIndex) {
		if (editor.editor && editor.editor.scroll && editor.editor.scroll.domNode) {
			editor.editor.scroll.domNode.tabIndex = tabIndex;
		}
	},

	/*
	Returns an weaker, unprivileged proxy object that only
	exposes read-only accessors found on the editor instance,
	without any state-modificating methods.
	*/
	makeUnprivilegedEditor: function(editor) {
		var e = editor;
		return {
			getLength:    function(){ return e.getLength.apply(e, arguments); },
			getText:      function(){ return e.getText.apply(e, arguments); },
			getHTML:      function(){ return e.root.innerHTML },
			getContents:  function(){ return e.getContents.apply(e, arguments); },
			getSelection: function(){ return e.getSelection.apply(e, arguments); },
			getBounds:    function(){ return e.getBounds.apply(e, arguments); },
		};
	}

};

module.exports = QuillMixin;
