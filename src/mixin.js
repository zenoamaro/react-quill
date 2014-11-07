'use strict';

var React = require('react'),
	Quill = require('quilljs'),
	T = React.PropTypes;

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
		var self = this;
		editor.on('text-change', function(delta, source) {
			if (self.onEditorChange) {
				self.onEditorChange(editor.getHTML(), delta, source);
			}
		});
	},

	updateEditor: function(editor, config) {
		// TODO: Unfortunately, while we can add modules and
		//       stuff, we can't remove them. And there is
		//       little API to update other parts of the config.
		//       But if we could tear down the editor, at least
		//       we could do a re-init with the new config.
		throw new Error('Not implemented');
	},

	destroyEditor: function(editor) {
		// TODO: How to destroy this?
		// editor.destroy();
		editor.removeAllListeners();
	},

	/*
	Replace the contents of the editor, but keep
	the previous selection hanging around so that
	the cursor won't move.
	*/
	setEditorContents: function(editor, value) {
		var sel = editor.getSelection();
		editor.setHTML(value);
		editor.setSelection(sel);
	}

};

module.exports = QuillMixin;