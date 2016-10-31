import Quill from 'quill'

export const QuillMixin = {
  createEditor,
  hookEditor,
  setEditorReadOnly,
  setEditorContents,
  setEditorSelection,
  makeUnprivilegedEditor
}


/**
Creates an editor on the given element. The editor will
be passed the configuration, have its events bound,
*/
function createEditor ($el, config) {
  var editor = new Quill($el, config);
  this.hookEditor(editor);
  return editor;
}

function hookEditor (editor) {
  // Expose the editor on change events via a weaker,
  // unprivileged proxy object that does not allow
  // accidentally modifying editor state.
  var unprivilegedEditor = this.makeUnprivilegedEditor(editor);

  editor
    .on('text-change', (delta, oldDelta, source) => {
      if (this.onEditorChange) {
        this.onEditorChange(
          editor.root.innerHTML,
          delta,
          source,
          unprivilegedEditor
        )
      }
    })

  editor
    .on('selection-change', (range, oldRange, source) => {
      if (this.onEditorChangeSelection) {
        this.onEditorChangeSelection(
          range,
          source,
          unprivilegedEditor
        );
      }
    })
}

function setEditorReadOnly (editor, value) {
  value ? editor.disable() : editor.enable();
}

/*
Replace the contents of the editor, but keep
the previous selection hanging around so that
the cursor won't move.
*/
function setEditorContents (editor, value) {
  const sel = editor.getSelection()
  editor.pasteHTML(value || '')
  if (sel) this.setEditorSelection(editor, sel)
}

function setEditorSelection (editor, range) {
  if (range) {
    // Validate bounds before applying.
    var length = editor.getLength()
    range.index = Math.max(0, Math.min(range.index, range.length-1))
    range.length = length
  }
  editor.setSelection(range)
}

/*
Returns an weaker, unprivileged proxy object that only
exposes read-only accessors found on the editor instance,
without any state-modificating methods.
*/
function makeUnprivilegedEditor(editor) {
  var e = editor
  return {
    getLength:    () => {e.getLength.apply(e, arguments) },
    getText:      () => {e.getText.apply(e, arguments) },
    getContents:  () => {e.getContents.apply(e, arguments) },
    getSelection: () => {e.getSelection.apply(e, arguments) },
    getBounds:    () => {e.getBounds.apply(e, arguments) },
  }
}
