import React from 'react';
import ReactDOM from 'react-dom';
import QuillMixin from './mixin';
import some from 'lodash/some';
import isEqual from 'lodash/isEqual';

export default class Component extends React.Component {

	static displayName = 'React Quill'

	/*
	Changing one of these props should cause a full re-render and a
	reinstantiation of the Quill editor.
	*/
	dirtyProps = [
		'modules',
		'formats',
		'bounds',
		'theme',
		'children',
	]

	/*
	Changing one of these props should cause a regular update. These are mostly
	props that act on the container, rather than the quillized editing area.
	*/
	cleanProps = [
		'id',
		'className',
		'style',
		'readOnly',
		'placeholder',
		'tabIndex',
		'onChange',
		'onChangeSelection',
		'onFocus',
		'onBlur',
		'onKeyPress',
		'onKeyDown',
		'onKeyUp',
	]

	static defaultProps = {
		theme: 'snow',
		modules: {},
	}

	state = {
		generation: 0,
		value: '',
	}

	constructor(props) {
		super(props);
		this.state.value = this.isControlled()? props.value : props.defaultValue;
	}

	validateProps(props) {
		if ('toolbar' in props) throw new Error(
			'The `toolbar` prop has been deprecated. Use `modules.toolbar` instead. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100'
		);

		if (props.modules?.toolbar?.[0]?.type) throw new Error(
			'Since v1.0.0, React Quill will not create a custom toolbar for you ' +
			'anymore. Create a toolbar explictly, or let Quill create one. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100'
		);

		if (props.formats && (
			!(props.formats instanceof Array) ||
			some(props.formats, x => typeof x !== 'string')
		)) throw new Error(
			'You cannot specify custom `formats` anymore. Use Parchment instead.  ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.'
		);

		if ('styles' in props) throw new Error(
			'The `styles` prop has been deprecated. Use custom stylesheets instead. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.'
		);

		if ('pollInterval' in props) throw new Error(
			'The `pollInterval` property does not have any effect anymore. ' +
			'Remove it from your props. ' +
			'See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.'
		);

		if (React.Children.count(props.children) > 1) throw new Error(
			'The Quill editing area can only be composed of a single React element.'
		);

		if (React.Children.count(props.children)) {
			var child = React.Children.only(props.children);
			if (child.type === 'textarea') throw new Error(
				'Quill does not support editing on a <textarea>. Use a <div> instead.'
			);
		}

		if (
			this.lastDeltaChangeSet &&
			props.value === this.lastDeltaChangeSet
		) throw new Error(
			'You are passing the `delta` object from the `onChange` event back ' +
			'as `value`. You most probably want `editor.getContents()` instead. ' +
			'See: https://github.com/zenoamaro/react-quill#using-deltas'
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// TODO: Is there a better place to validate props?
		this.validateProps(nextProps);

		// If the component has been regenerated, we already know we should update.
		if (this.state.generation !== nextState.generation) {
			return true;
		}

		return some([...this.cleanProps, ...this.dirtyProps], (prop) => {
			return !isEqual(nextProps[prop], this.props[prop]);
		});
	}

	shouldComponentRegenerate(nextProps, nextState) {
		// Whenever a `dirtyProp` changes, the editor needs reinstantiation.
		return some(this.dirtyProps, (prop) => {
			return !isEqual(nextProps[prop], this.props[prop]);
		});
	}

	componentDidMount() {
		this.instantiateEditor();
		this.setEditorContents(this.editor, this.state.value);
	}

	componentWillUnmount() {
		this.destroyEditor();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// If we're changing one of the `dirtyProps`, the entire Quill Editor needs
		// to be re-instantiated. Regenerating the editor will cause the whole tree,
		// including the container, to be cleaned up and re-rendered from scratch.
		// Store the contents so they can be restored later.
		if (this.shouldComponentRegenerate(prevProps, prevState)) {
			const delta = this.editor.getContents();
			const selection = this.editor.getSelection();
			this.regenerationSnapshot = {delta, selection};
			this.setState({generation: this.state.generation + 1});
			this.destroyEditor();
		}

		// The component has been regenerated, so it must be re-instantiated, and
		// its content must be restored to the previous values from the snapshot.
		if (this.state.generation !== prevState.generation) {
			this.instantiateEditor();
			this.editor.setContents(this.regenerationSnapshot.delta);
			this.editor.setSelection(this.regenerationSnapshot.selection);
			delete this.regenerationSnapshot;
			this.editor.focus();
		}

		// Update only if we've been passed a new `value`. This leaves components
		// using `defaultValue` alone.
		if ('value' in this.props) {
			var prevContents = prevState.value;
			var nextContents = this.props.value;

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

		// We can update readOnly state in-place.
		if ('readOnly' in this.props) {
			if (this.props.readOnly !== prevProps.readOnly) {
				this.setEditorReadOnly(this.editor, this.props.readOnly);
			}
		}
	}

	instantiateEditor() {
		if (this.editor) {
			throw new Error('Editor is already instantiated');
		}
		this.editor = this.createEditor(
			this.getEditingArea(),
			this.getEditorConfig()
		);
	}

	destroyEditor() {
		if (!this.editor) {
			throw new Error('Destroying editor before instantiation');
		}
		this.unhookEditor(this.editor);
		this.editor = null;
	}

	/*
	We consider the component to be controlled if `value` is being sent in props.
	*/
	isControlled() {
		return 'value' in this.props;
	}

	getEditorConfig() {
		return {
			bounds:       this.props.bounds,
			formats:      this.props.formats,
			modules:      this.props.modules,
			placeholder:  this.props.placeholder,
			readOnly:     this.props.readOnly,
			scrollingContainer: this.props.scrollingContainer,
			tabIndex:     this.props.tabIndex,
			theme:        this.props.theme,
		};
	}

	getEditor() {
		return this.editor;
	}

	getEditingArea () {
		return ReactDOM.findDOMNode(this.editingArea);
	}

	getEditorContents() {
		return this.state.value;
	}

	getEditorSelection() {
		return this.state.selection;
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
	Renders an editor area, unless it has been provided one to clone.
	*/
	renderEditingArea() {
		var self = this;
		var children = this.props.children;
		var preserveWhitespace = this.props.preserveWhitespace;

		var properties = {
			key: this.state.generation,
			tabIndex: this.props.tabIndex,
			ref(element) { self.editingArea = element },
		};

		if (React.Children.count(children)) {
			return React.cloneElement(
				React.Children.only(children),
				properties
			);
		}

		return preserveWhitespace ?
			<pre {...properties}/> :
			<div {...properties}/>;
	}

	render() {
		return (
			<div
				id={this.props.id}
				style={this.props.style}
				key={this.state.generation}
				className={['quill'].concat(this.props.className).join(' ')}
				onKeyPress={this.props.onKeyPress}
				onKeyDown={this.props.onKeyDown}
				onKeyUp={this.props.onKeyUp}
			>
				{this.renderEditingArea()}
			</div>
		);
	}

	onEditorChangeText(value, delta, source, editor) {
		var currentContents = this.getEditorContents();

		// We keep storing the same type of value as what the user gives us,
		// so that value comparisons will be more stable and predictable.
		var nextContents = this.isDelta(currentContents)
			? editor.getContents()
			: editor.getHTML();

		if (!this.isEqualValue(nextContents, currentContents)) {
			// Taint this `delta` object, so we can recognize whether the user
			// is trying to send it back as `value`, preventing a likely loop.
			this.lastDeltaChangeSet = delta;

			this.setState({ value: nextContents });

			if (this.props.onChange) {
				this.props.onChange(value, delta, source, editor);
			}
		}
	}

	onEditorChangeSelection(nextSelection, source, editor) {
		var currentSelection = this.getEditorSelection();
		var hasGainedFocus = !currentSelection && nextSelection;
		var hasLostFocus = currentSelection && !nextSelection;

		if (isEqual(nextSelection, currentSelection)) {
			return;
		}

		this.setState({ selection: nextSelection });

		if (this.props.onChangeSelection) {
			this.props.onChangeSelection(nextSelection, source, editor);
		}

		if (hasGainedFocus && this.props.onFocus) {
			this.props.onFocus(nextSelection, source, editor);
		} else if (hasLostFocus && this.props.onBlur) {
			this.props.onBlur(currentSelection, source, editor);
		}
	}

	focus() {
		this.editor.focus();
	}

	blur() {
		this.setEditorSelection(this.editor, null);
	}

}

// FIXME: Understand what to do with Mixin
Object.assign(Component.prototype, QuillMixin);
