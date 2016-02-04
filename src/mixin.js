'use strict';

var Quill = require('quill');

var QuillMixin = {

	/**
	Creates an editor on the given element. The editor will
	be passed the configuration, have its events bound,
	*/
	createEditor: function($el, config) {
		var editor = new Quill($el, config);
		this.hookEditor(editor);
		return editor;
	},

	hookEditor: function(editor) {
		// Expose the editor on change events via a weaker,
		// unprivileged proxy object that does not allow
		// accidentally modifying editor state.
		var unprivilegedEditor = this.makeUnprivilegedEditor(editor);

		editor.on('text-change', function(delta, source) {
			if (this.onEditorChange) {
				this.onEditorChange(
					editor.getHTML(), delta, source,
					unprivilegedEditor
				);
			}
		}.bind(this));

		editor.on('selection-change', function(range, source) {
			if (this.onEditorChangeSelection) {
				this.onEditorChangeSelection(
					range, source,
					unprivilegedEditor
				);
			}
		}.bind(this));
	},

	destroyEditor: function(editor) {
		editor.destroy();
	},

	setEditorReadOnly: function(editor, value) {
		value? editor.editor.disable()
		     : editor.editor.enable();
	},

	/*
	Replace the contents of the editor, but keep
	the previous selection hanging around so that
	the cursor won't move.
	*/
	setEditorContents: function(editor, value) {
		var sel = editor.getSelection();
		editor.setHTML(value || '');
		if (sel) this.setEditorSelection(editor, sel);
	},

	setEditorSelection: function(editor, range) {
		if (range) {
			// Validate bounds before applying.
			var length = editor.getLength();
			range.start = Math.max(0, Math.min(range.start, length-1));
			range.end = Math.max(range.start, Math.min(range.end, length-1));
		}
		editor.setSelection(range);
	},

	/*
	Returns an weaker, unprivileged proxy object that only
	exposes read-only accessors found on the editor instance,
	without any state-modificating methods.
	*/
	makeUnprivilegedEditor: function(editor) {
		var e = editor;
		return {
			getLength:    function(){ e.getLength.apply(e, arguments); },
			getText:      function(){ e.getText.apply(e, arguments); },
			getHTML:      function(){ e.getHTML.apply(e, arguments); },
			getContents:  function(){ e.getContents.apply(e, arguments); },
			getSelection: function(){ e.getSelection.apply(e, arguments); },
			getBounds:    function(){ e.getBounds.apply(e, arguments); },
		};
	}

};

module.exports = QuillMixin;
