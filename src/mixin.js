'use strict';

var React = require('react'),
	Quill = require('quill'),
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
		// NOTE: This tears the editor down, and reinitializes
		//       it with the new config. Ugly but necessary
		//       as there is no api for updating it.
		this.destroyEditor(editor);
		this.createEditor(config);
		return editor;
	},

	destroyEditor: function(editor) {
		editor.destroy();
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