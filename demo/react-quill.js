/*
React-Quill
https://github.com/zenoamaro/react-quill
*/
import React, { createRef } from 'react';
import { isEqual } from 'lodash-es';
import Quill from 'quill';
export { Quill };
class ReactQuill extends React.Component {
  constructor(props) {
    super(props);
    this.editingAreaRef = createRef();
    /*
        Changing one of these props should cause a full re-render and a
        re-instantiation of the Quill editor.
        */
    this.dirtyProps = ['modules', 'formats', 'bounds', 'theme', 'children'];
    /*
        Changing one of these props should cause a regular update. These are mostly
        props that act on the container, rather than the quillized editing area.
        */
    this.cleanProps = [
      'id',
      'className',
      'style',
      'placeholder',
      'tabIndex',
      'onChange',
      'onChangeSelection',
      'onFocus',
      'onBlur',
      'onKeyPress',
      'onKeyDown',
      'onKeyUp',
    ];
    this.state = {
      generation: 0,
    };
    /*
        Tracks the internal selection of the Quill editor
        */
    this.selection = null;
    this.onEditorChange = (
      eventName,
      rangeOrDelta,
      oldRangeOrDelta,
      source
    ) => {
      if (eventName === 'text-change') {
        this.onEditorChangeText?.(
          this.editor.root.innerHTML,
          rangeOrDelta,
          source,
          this.unprivilegedEditor
        );
      } else if (eventName === 'selection-change') {
        this.onEditorChangeSelection?.(
          rangeOrDelta,
          source,
          this.unprivilegedEditor
        );
      }
    };
    const value = this.isControlled() ? props.value : props.defaultValue;
    this.value = value ?? '';
  }
  validateProps(props) {
    if (React.Children.count(props.children) > 1)
      throw new Error(
        'The Quill editing area can only be composed of a single React element.'
      );
    if (React.Children.count(props.children)) {
      const child = React.Children.only(props.children);
      if (child?.type === 'textarea')
        throw new Error(
          'Quill does not support editing on a <textarea>. Use a <div> instead.'
        );
    }
    if (this.lastDeltaChangeSet && props.value === this.lastDeltaChangeSet)
      throw new Error(
        'You are passing the `delta` object from the `onChange` event back ' +
          'as `value`. You most probably want `editor.getContents()` instead. ' +
          'See: https://github.com/zenoamaro/react-quill#using-deltas'
      );
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.validateProps(nextProps);
    // If the editor hasn't been instantiated yet, or the component has been
    // regenerated, we already know we should update.
    if (!this.editor || this.state.generation !== nextState.generation) {
      return true;
    }
    // Handle value changes in-place
    if ('value' in nextProps) {
      const prevContents = this.getEditorContents();
      const nextContents = nextProps.value ?? '';
      // NOTE: Seeing that Quill is missing a way to prevent edits, we have to
      //       settle for a hybrid between controlled and uncontrolled mode. We
      //       can't prevent the change, but we'll still override content
      //       whenever `value` differs from current state.
      // NOTE: Comparing an HTML string and a Quill Delta will always trigger a
      //       change, regardless of whether they represent the same document.
      if (!this.isEqualValue(nextContents, prevContents)) {
        this.setEditorContents(this.editor, nextContents);
      }
    }
    // Handle read-only changes in-place
    if (nextProps.readOnly !== this.props.readOnly) {
      this.setEditorReadOnly(this.editor, nextProps.readOnly);
    }
    // Clean and Dirty props require a render
    return [...this.cleanProps, ...this.dirtyProps].some((prop) => {
      return !isEqual(nextProps[prop], this.props[prop]);
    });
  }
  shouldComponentRegenerate(nextProps) {
    // Whenever a `dirtyProp` changes, the editor needs reinstantiation.
    return this.dirtyProps.some((prop) => {
      return !isEqual(nextProps[prop], this.props[prop]);
    });
  }
  componentDidMount() {
    this.instantiateEditor();
    this.setEditorContents(this.editor, this.getEditorContents());
  }
  componentWillUnmount() {
    this.destroyEditor();
  }
  componentDidUpdate(prevProps, prevState) {
    // If we're changing one of the `dirtyProps`, the entire Quill Editor needs
    // to be re-instantiated. Regenerating the editor will cause the whole tree,
    // including the container, to be cleaned up and re-rendered from scratch.
    // Store the contents so they can be restored later.
    if (this.editor && this.shouldComponentRegenerate(prevProps)) {
      const delta = this.editor.getContents();
      const selection = this.editor.getSelection();
      this.regenerationSnapshot = { delta, selection };
      this.setState({ generation: this.state.generation + 1 });
      this.destroyEditor();
    }
    // The component has been regenerated, so it must be re-instantiated, and
    // its content must be restored to the previous values from the snapshot.
    if (this.state.generation !== prevState.generation) {
      const { delta, selection } = this.regenerationSnapshot;
      delete this.regenerationSnapshot;
      this.instantiateEditor();
      const editor = this.editor;
      editor.setContents(delta);
      postpone(() => this.setEditorSelection(editor, selection));
    }
  }
  instantiateEditor() {
    if (this.editor) {
      this.hookEditor(this.editor);
    } else {
      this.editor = this.createEditor(
        this.getEditingArea(),
        this.getEditorConfig()
      );
    }
  }
  destroyEditor() {
    if (!this.editor) return;
    this.unhookEditor(this.editor);
  }
  /*
    We consider the component to be controlled if `value` is being sent in props.
    */
  isControlled() {
    return 'value' in this.props;
  }
  getEditorConfig() {
    return {
      bounds: this.props.bounds,
      formats: this.props.formats,
      modules: this.props.modules,
      placeholder: this.props.placeholder,
      readOnly: this.props.readOnly,
      tabIndex: this.props.tabIndex,
      theme: this.props.theme,
    };
  }
  getEditor() {
    if (!this.editor) throw new Error('Accessing non-instantiated editor');
    return this.editor;
  }
  /**
    Creates an editor on the given element. The editor will be passed the
    configuration, have its events bound,
    */
  createEditor(element, config) {
    const editor = new Quill(element, config);
    if (config.tabIndex != null) {
      this.setEditorTabIndex(editor, config.tabIndex);
    }
    this.hookEditor(editor);
    return editor;
  }
  hookEditor(editor) {
    // Expose the editor on change events via a weaker, unprivileged proxy
    // object that does not allow accidentally modifying editor state.
    this.unprivilegedEditor = this.makeUnprivilegedEditor(editor);
    // Using `editor-change` allows picking up silent updates, like selection
    // changes on typing.
    editor.on('editor-change', this.onEditorChange);
  }
  unhookEditor(editor) {
    editor.off('editor-change', this.onEditorChange);
  }
  getEditorContents() {
    return this.value;
  }
  getEditorSelection() {
    return this.selection;
  }
  /*
    True if the value is a Delta instance or a Delta look-alike.
    */
  isDelta(value) {
    return value && value.ops;
  }
  /*
    Special comparison function that knows how to compare Deltas.
    */
  isEqualValue(value, nextValue) {
    if (this.isDelta(value) && this.isDelta(nextValue)) {
      return isEqual(value.ops, nextValue.ops);
    } else {
      return isEqual(value, nextValue);
    }
  }
  /*
    Replace the contents of the editor, but keep the previous selection hanging
    around so that the cursor won't move.
    */
  setEditorContents(editor, value) {
    this.value = value;
    const sel = this.getEditorSelection();
    if (typeof value === 'string') {
      editor.setContents(editor.clipboard.convert({ html: value }));
    } else {
      editor.setContents(value);
    }
    postpone(() => this.setEditorSelection(editor, sel));
  }
  setEditorSelection(editor, range) {
    this.selection = range;
    if (range) {
      // Validate bounds before applying.
      const length = editor.getLength();
      range.index = Math.max(0, Math.min(range.index, length - 1));
      range.length = Math.max(
        0,
        Math.min(range.length, length - 1 - range.index)
      );
      editor.setSelection(range);
    }
  }
  setEditorTabIndex(editor, tabIndex) {
    if (editor?.scroll?.domNode) {
      editor.scroll.domNode.tabIndex = tabIndex;
    }
  }
  setEditorReadOnly(editor, value) {
    if (value) {
      editor.disable();
    } else {
      editor.enable();
    }
  }
  /*
    Returns a weaker, unprivileged proxy object that only exposes read-only
    accessors found on the editor instance, without any state-modifying methods.
    */
  makeUnprivilegedEditor(editor) {
    const e = editor;
    return {
      getHTML: () => e.root.innerHTML,
      getSemanticHTML: e.getSemanticHTML.bind(e),
      getLength: e.getLength.bind(e),
      getText: e.getText.bind(e),
      getContents: e.getContents.bind(e),
      getSelection: e.getSelection.bind(e),
      getBounds: e.getBounds.bind(e),
    };
  }
  getEditingArea() {
    const element = this.editingAreaRef.current;
    if (!element) {
      throw new Error('Cannot find element for editing area');
    }
    if (element.nodeType === 3) {
      throw new Error('Editing area cannot be a text node');
    }
    return element;
  }
  /*
    Renders an editor area, unless it has been provided one to clone.
    */
  renderEditingArea() {
    const { children, preserveWhitespace } = this.props;
    const { generation } = this.state;
    const properties = {
      key: generation,
      ref: this.editingAreaRef,
    };
    if (React.Children.count(children)) {
      return React.cloneElement(React.Children.only(children), properties);
    }
    return preserveWhitespace
      ? React.createElement('pre', { ...properties })
      : React.createElement('div', { ...properties });
  }
  render() {
    return React.createElement(
      'div',
      {
        id: this.props.id,
        style: this.props.style,
        key: this.state.generation,
        className: `quill ${this.props.className ?? ''}`,
        onKeyPress: this.props.onKeyPress,
        onKeyDown: this.props.onKeyDown,
        onKeyUp: this.props.onKeyUp,
      },
      this.renderEditingArea()
    );
  }
  onEditorChangeText(value, delta, source, editor) {
    if (!this.editor) return;
    // We keep storing the same type of value as what the user gives us,
    // so that value comparisons will be more stable and predictable.
    const nextContents = this.isDelta(this.value)
      ? editor.getContents()
      : editor.getHTML();
    if (nextContents !== this.getEditorContents()) {
      // Taint this `delta` object, so we can recognize whether the user
      // is trying to send it back as `value`, preventing a likely loop.
      this.lastDeltaChangeSet = delta;
      this.value = nextContents;
      this.props.onChange?.(value, delta, source, editor);
    }
  }
  onEditorChangeSelection(nextSelection, source, editor) {
    if (!this.editor) return;
    const currentSelection = this.getEditorSelection();
    const hasGainedFocus = !currentSelection && nextSelection;
    const hasLostFocus = currentSelection && !nextSelection;
    if (isEqual(nextSelection, currentSelection)) return;
    this.selection = nextSelection;
    this.props.onChangeSelection?.(nextSelection, source, editor);
    if (hasGainedFocus) {
      this.props.onFocus?.(nextSelection, source, editor);
    } else if (hasLostFocus) {
      this.props.onBlur?.(currentSelection, source, editor);
    }
  }
  focus() {
    if (!this.editor) return;
    this.editor.focus();
  }
  blur() {
    if (!this.editor) return;
    this.selection = null;
    this.editor.blur();
  }
}
ReactQuill.displayName = 'React Quill';
/*
Export Quill to be able to call `register`
*/
ReactQuill.Quill = Quill;
ReactQuill.defaultProps = {
  theme: 'snow',
  modules: {},
  readOnly: false,
};
/*
Small helper to execute a function in the next micro-tick.
*/
function postpone(fn) {
  Promise.resolve().then(fn);
}
export default ReactQuill;
//# sourceMappingURL=index.js.map
