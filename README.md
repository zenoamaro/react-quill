ReactQuill [![Build Status](https://travis-ci.org/zenoamaro/react-quill.svg?branch=master)](https://travis-ci.org/zenoamaro/react-quill) [![npm](https://img.shields.io/npm/v/react-quill.svg)](https://www.npmjs.com/package/react-quill)
[![npm downloads](https://img.shields.io/npm/dt/react-quill.svg?maxAge=2592000)](http://www.npmtrends.com/react-quill)
==============================================================================

A [Quill] component for [React].

See a [live demo] or [Codepen](http://codepen.io/alexkrolick/pen/xgyOXQ/left?editors=0010#0).

[quill]: https://quilljs.com
[react]: https://facebook.github.io/react/
[live demo]: https://zenoamaro.github.io/react-quill/

- [Quick Start](#quick-start)
  - [With webpack or create-react-app](#with-webpack-or-create-react-app)
  - [With the browser bundle](#with-the-browser-bundle)
- [Usage](#usage)
  - [Controlled mode caveats](#controlled-mode-caveats)
  - [Using Deltas](#using-deltas)
  - [Themes](#themes)
  - [Custom Toolbar](#custom-toolbar)
    - [Default Toolbar Elements](#default-toolbar-elements)
    - [HTML Toolbar](#html-toolbar)
  - [Custom Formats](#custom-formats)
  - [Custom editing area](#custom-editing-area)
- [Upgrading to ReactQuill v2](#upgrading-to-reactquill-v2)
  - [Deprecated props](#deprecated-props)
  - [ReactQuill Mixin](#reactquill-mixin)
  - [Toolbar component](#toolbar-component)
- [API reference](#api-reference)
  - [Exports](#exports)
  - [Props](#props)
  - [Methods](#methods)
  - [The unprivileged editor](#the-unprivileged-editor)
- [Building and testing](#building-and-testing)
- [Browser support](#browser-support)
- [Changelog](#changelog)
- [Contributors](#contributors)
- [License](#license)

---

This is the documentation for ReactQuill v2 — Previous releases: [v1](/../../tree/v1)

---

💯 **ReactQuill v2**

ReactQuill 2 is here, baby! And it brings a full port to TypeScript and React 16+, a refactored build system, and a general tightening of the internal logic.

We worked hard to avoid introducing any behavioral changes. For the vast majority of the cases, no migration is necessary at all. However, support for long-deprecated props, the ReactQuill Mixin, and the Toolbar component have been removed. Be sure to read the [migration guide](#upgrading-to-reactquill-v2).

We expect this release to be a drop-in upgrade – if that isn't the case, please [file an issue](/../../issues/new) with the `v2` label.

---

## Quick Start

### With webpack or create-react-app

Make sure you have `react` and `react-dom`, and some way to load styles, like [style-loader](https://www.npmjs.com/package/style-loader). See the documentation on [themes](#themes) for more information.

```sh
npm install react-quill --save
```

```jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function MyComponent() {
  const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
}
```

### With the browser bundle

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
/>
```

```html
<script
  src="https://unpkg.com/react@16/umd/react.development.js"
  crossorigin
></script>
<script
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
  crossorigin
></script>
<script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<script type="text/babel" src="/my-scripts.js"></script>
```

## Usage

### Controlled mode caveats

In controlled mode, components are supposed to prevent local stateful changes, and instead only have them happen through `onChange` and `value`.

Because Quill handles its own changes, and does not allow preventing edits, ReactQuill has to settle for a hybrid between controlled and uncontrolled mode. It can't prevent the change, but will still override the content whenever `value` differs from current state.

If you frequently need to manipulate the DOM or use the [Quill API](https://quilljs.com/docs/api/)s imperatively, you might consider switching to fully uncontrolled mode. ReactQuill will initialize the editor using `defaultValue`, but won't try to reset it after that. The `onChange` callback will still work as expected.

Read more about uncontrolled components in the [React docs](https://facebook.github.io/react/docs/uncontrolled-components.html#default-values).

### Using Deltas

You can pass a [Quill Delta](https://quilljs.com/docs/delta/), instead of an HTML string, as the `value` and `defaultValue` properties. Deltas have a number of advantages over HTML strings, so you might want use them instead. Be aware, however, that comparing Deltas for changes is more expensive than comparing HTML strings, so it might be worth to profile your usage patterns.

Note that switching `value` from an HTML string to a Delta, or vice-versa, will trigger a change, regardless of whether they represent the same document, so you might want to stick to a format and keep using it consistently throughout.

⚠️ Do not use the `delta` object you receive from the `onChange` event as `value`. This object does not contain the full document, but only the last modifications, and doing so will most likely trigger an infinite loop where the same changes are applied over and over again. Use `editor.getContents()` during the event to obtain a Delta of the full document instead. ReactQuill will prevent you from making such a mistake, however if you are absolutely sure that this is what you want, you can pass the object through `new Delta()` again to un-taint it.

### Themes

The Quill editor supports [themes](http://quilljs.com/docs/themes/). It includes a full-fledged theme, called _snow_, that is Quill's standard appearance, and a _bubble_ theme that is similar to the inline editor on Medium. At the very least, the _core_ theme must be included for modules like toolbars or tooltips to work.

To activate a theme, pass the name of the theme to the `theme` [prop](#props). Pass a falsy value (eg. `null`) to use the core theme.

```jsx
<ReactQuill theme="snow" .../>
```

Then, import the stylesheet for the themes you want to use.

This may vary depending how application is structured, directories or otherwise. For example, if you use a CSS pre-processor like SASS, you may want to import that stylesheet inside your own. These stylesheets can be found in the Quill distribution, but for convenience they are also linked in ReactQuill's `dist` folder.

Here's an example using [style-loader](https://www.npmjs.com/package/style-loader) for Webpack, or `create-react-app`, that will automatically inject the styles on the page:

```jsx
import 'react-quill/dist/quill.snow.css';
```

The styles are also available via CDN:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
/>
```

### Custom Toolbar

#### Default Toolbar Elements

The [Quill Toolbar Module](http://quilljs.com/docs/modules/toolbar/) API provides an easy way to configure the default toolbar icons using an array of format names.

<details>
<summary>Example Code</summary>

```jsx
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    }
  }

  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  },

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ],

  render() {
    return (
      <div className="text-editor">
        <ReactQuill theme="snow"
                    modules={this.modules}
                    formats={this.formats}>
        </ReactQuill>
      </div>
    );
  }
}

export default MyComponent;
```

</details>

#### HTML Toolbar

You can also supply your own HTML/JSX toolbar with custom elements that are not part of the Quill theme.

See this example live on Codepen: [Custom Toolbar Example](https://codepen.io/alexkrolick/pen/gmroPj?editors=0010)

<details>
<summary>Example Code</summary>

```jsx
/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const CustomButton = () => <span className="octicon octicon-star" />;

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, '★');
  this.quill.setSelection(cursorPosition + 1);
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <select
      className="ql-header"
      defaultValue={''}
      onChange={(e) => e.persist()}
    >
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
    <button className="ql-insertStar">
      <CustomButton />
    </button>
  </div>
);

/*
 * Editor component with custom toolbar and content containers
 */
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
  }

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      insertStar: insertStar,
    },
  },
};

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
];

/*
 * PropType validation
 */
Editor.propTypes = {
  placeholder: React.PropTypes.string,
};

/*
 * Render component on page
 */
ReactDOM.render(
  <Editor placeholder={'Write something or insert a star ★'} />,
  document.querySelector('.app')
);
```

</details>

### Custom Formats

The component has two types of formats:

1. The default [Quill formats](http://quilljs.com/docs/formats/) that are enabled/disabled using the [`formats` prop](#props). All formats are enabled by default.
2. Custom formats created using Parchment and registered with your component's Quill instance

<details>
<summary>Example Code</summary>

```js
import ReactQuill, { Quill } from 'react-quill'; // ES6
const ReactQuill = require('react-quill'); // CommonJS
```

```jsx
/*
 * Example Parchment format from
 * https://quilljs.com/guides/cloning-medium-with-parchment/
 * See the video example in the guide for a complex format
 */
let Inline = Quill.import('blots/inline');
class BoldBlot extends Inline {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';
Quill.register('formats/bold', BoldBlot);

const formats = ['bold']; // add custom format name + any built-in formats you need

/*
 * Editor component with default and custom formats
 */
class MyComponent extends React.Component {
  constructor(props) {
    this.formats = formats;
    this.state = { text: '' };
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <ReactQuill
        value={this.state.text}
        onChange={this.handleChange}
        formats={this.formats}
      />
    );
  }
}
```

</details>

### Custom editing area

If you instantiate ReactQuill without children, it will create a `<div>` for you, to be used as the editing area for Quill. If you prefer, you can specify your own element for ReactQuill to use. Note that `<textarea>`s are not supported by Quill at this time.

Note: Custom editing areas lose focus when using React 16 as a peer dep at this time ([bug](https://github.com/zenoamaro/react-quill/issues/309)).

<details>

```jsx
class MyComponent extends React.Component {

  render() {
    return (
      <ReactQuill>
        <div className="my-editing-area"/>
      </ReactQuill>
    );
  }

});
```

</details>

## Upgrading to ReactQuill v2

Upgrading to ReactQuill v2 should be as simple as updating your dependency. However, it also removes support for long-deprecated props, the ReactQuill Mixin, and the Toolbar component.

### Deprecated props

Support for the `toolbar`, `styles`, `pollInterval` Quill options has long disabled. Starting from this release, ReactQuill will not warn you anymore if you try using them.

### ReactQuill Mixin

The ReactQuill Mixin allowed injecting the core functionality that made ReactQuill tick into your own components, and create deeply customized versions.

The Mixin has been considered an anti-pattern for a long time now, so we have decided to finalize its deprecation.

There is no upgrade path. If you have a use case that relied on the Mixin, you're encouraged to open an issue, and we will try to provide you with a new feature to make it possible, or dedicated support to migrate out of it.

### Toolbar component

Quill has long provided built-in support for custom toolbars, which replaced ReactQuill's (quite inflexible) Toolbar component.

Use the [Toolbar Module](#default-toolbar-elements) or the [HTML Toolbar](#html-toolbar) feature instead.

## API reference

### Exports

```jsx
// ES6
import ReactQuill, { Quill } from 'react-quill';

// CommonJS
const ReactQuill = require('react-quill');
const { Quill } = ReactQuill;
```

`Quill`
: The `Quill` namespace on which you can call `register`.

### Props

`id`
: ID to be applied to the DOM element.

`className`
: Classes to be applied to the DOM element.

`value`
: Value for the editor as a controlled component. Can be a string containing HTML, a [Quill Delta](https://quilljs.com/docs/delta/) instance, or a plain object representing a Delta.
Note that due to limitations in Quill, this is actually a _semi-controlled_ mode, meaning that the edit is not prevented, but changing `value` will still replace the contents.
Also note that passing a Quill Delta here, and then an HTML string, or vice-versa, will always trigger a change, regardless of whether they represent the same document.
⚠️ Do not pass the `delta` object from the `onChange` event as `value`, as it will cause a loop. See [Using Deltas](#using-deltas) for details.

`defaultValue`
: Initial value for the editor as an uncontrolled component. Can be a string containing HTML, a [Quill Delta](https://quilljs.com/docs/delta/), or a plain object representing a Delta.

`readOnly`
: If true, the editor won't allow changing its contents. Wraps the Quill [`disable` API](https://quilljs.com/docs/api/#enable).

`placeholder`
: The default value for the empty editor. Note: The Quill API does not support changing this value dynamically. Use refs and data-attributes instead (see [#340](https://github.com/zenoamaro/react-quill/issues/340#issuecomment-376176878)).

`modules`
: An object specifying which modules are enabled, and their configuration. The editor toolbar is a commonly customized module. See the [modules section](http://quilljs.com/docs/modules/) over the Quill documentation for more information on what modules are available.

`formats`
: An array of formats to be enabled during editing. All implemented formats are enabled by default. See [Formats](http://quilljs.com/docs/formats/) for a list.
Custom formats should not be included in the array as of version 1.0.0. Instead they should be created through [Parchment](https://github.com/quilljs/parchment) and registered with the module's [Quill export](#exports).

`style`
: An object with custom CSS rules to apply on the editor's container. Rules should be in React's "camelCased" naming style.

`theme`
: The name of the theme to apply to the editor. Defaults to `snow`, Quill's standard theme. Pass `null` to use the minimal core theme. See the [docs on themes](#themes) for more information on including the required stylesheets.

`tabIndex`
: The order in which the editor becomes focused, among other controls in the page, during keyboard navigation.

`bounds`
: Selector or DOM element used by Quill to constrain position of popups. Defaults to `document.body`.

`children`
: A single React element that will be used as the editing area for Quill in place of the default, which is a `<div>`. Note that you cannot use a `<textarea>`, as it is not a supported target. Also note that updating children is costly, as it will cause the Quill editor to be recreated. Set the `value` prop if you want to control the html contents of the editor.

`onChange(content, delta, source, editor)`
: Called back with the new contents of the editor after change. It will be passed the HTML contents of the editor, a delta object expressing the change, the source of the change, and finally a read-only proxy to [editor accessors](#the-unprivileged-editor) such as `getHTML()`.
⚠️ Do not use this `delta` object as `value`, as it will cause a loop. Use `editor.getContents()` instead. See [Using Deltas](#using-deltas) for details.

`onChangeSelection(range, source, editor)`
: Called back with the new selected range, or null when unfocused. It will be passed the selection range, the source of the change, and finally a read-only proxy to editor accessors such as `getBounds()`.

`onFocus(range, source, editor)`
: Called when the editor becomes focused. It will receive the new selection range.

`onBlur(previousRange, source, editor)`
: Called when the editor loses focus. It will receive the selection range it had right before losing focus.

`onKeyPress(event)`
: Called after a key has been pressed and released.
: Note that, like its native counterpart, this won't be called for special keys such as <kbd>shift</kbd> or <kbd>enter</kbd>. If you need those, hook onto `onKeyDown` or `onKeyUp`.

`onKeyDown(event)`
: Called after a key has been pressed, but before it is released.
: Note that, due to how Quill works, it's possible that you won't receive events for keys such as <kbd>enter</kbd>, <kbd>backspace</kbd> or <kbd>delete</kbd>. If that's the case, try hooking onto `onKeyUp` instead.

`onKeyUp(event)`
: Called after a key has been released.

`preserveWhitespace`
: If true, a `pre` tag is used for the editor area instead of the default `div` tag. This prevents Quill from
collapsing continuous whitespaces on paste. [Related issue](https://github.com/quilljs/quill/issues/1751).

### Methods

If you have [a ref](https://facebook.github.io/react/docs/more-about-refs.html) to a ReactQuill node, you will be able to invoke the following methods:

`focus()`
: Focuses the editor.

`blur()`
: Removes focus from the editor.

`getEditor()`
: Returns the Quill instance that backs the editor. While you can freely use this to access methods such as `getText()`, please avoid from imperatively manipulating the instance, to avoid getting ReactQuill and Quill out-of-sync. A much-safer [unprivileged editor](#the-unprivileged-editor) is available as replacement.

<details>
<summary>Example</summary>

[View this example on Codepen](https://codepen.io/alexkrolick/pen/YNmGar?editors=0011)

```jsx
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  insertText = () => {
    var range = this.quillRef.getSelection();
    let position = range ? range.index : 0;
    this.quillRef.insertText(position, 'Hello, World! ');
  };

  render() {
    return (
      <div>
        <ReactQuill
          ref={(el) => {
            this.reactQuillRef = el;
          }}
          theme={'snow'}
        />
        <button onClick={this.insertText}>Insert Text</button>
      </div>
    );
  }
}
```

</details>

`makeUnprivilegedEditor`
: Creates an [unprivileged editor](#unprivileged-editor). Pass this method a reference to the Quill instance from `getEditor`. Normally you do not need to use this method since the editor exposed to event handlers is already unprivileged.

<details>
<summary>Example</summary>

```jsx
const editor = this.reactQuillRef.getEditor();
const unprivilegedEditor = this.reactQuillRef.makeUnprivilegedEditor(editor);
// You may now use the unprivilegedEditor proxy methods
unprivilegedEditor.getText();
```

</details>

### The unprivileged editor

During events, ReactQuill will make a restricted subset of the Quill API available as the `editor` argument. This prevents access to destructive methods, which might cause ReactQuill to get out-of-sync with the component. It provides the following methods, which are mostly proxies of existing [Quill methods](https://quilljs.com/docs/api/):

`getLength()`
: Returns the length of the editor contents, in characters, not including any HTML tag.

`getText()`
: Returns the string contents of the editor, not including any HTML tag.

`getHTML()`
: Returns the full HTML contents of the editor.

`getContents()`
: Returns a [Quill Delta](https://quilljs.com/docs/delta/) of the complete document.

`getSelection()`
: Returns the current selection range, or `null` if the editor is unfocused.

`getBounds()`
: Returns the pixel position, relative to the editor container, and dimensions, of a selection, at a given location.

## Building and testing

You can build libs, types and bundles:

```sh
npm build  # or watch
```

You can also run the automated test suite:

```sh
npm test
```

More tasks are available as package scripts:

| Script          | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run build` | Builds lib and browser bundle               |
| `npm run watch` | Rebuilds on source code changes             |
| `npm run test`  | Runs unit tests and coverage                |
| `npm run clean` | Cleans build artifacts                      |
| `npm run demo`  | Serves a simple ReactQuill test application |

## Browser support

Please check the browser support table for the upstream [Quill](https://github.com/quilljs/quill) dependency. The ReactQuill distributable itself is ES5-compatible.

## Changelog

[Full changelog](CHANGELOG.md)

## Contributors

ReactQuill would not be where it is today without the contributions of many people, which we are incredibly grateful for:

- @zenoamaro (maintainer)
- @alexkrolick (maintainer)
- @clemmy
- @asiniy
- @webcarrot
- @druti
- @e-jigsaw
- @zhang-z
- @Sajam
- @0bird512
- @jacktrades
- @1000hz
- @kkerr1
- @csk157
- @Janekk
- @AndyTheGiant
- @chrismcv
- @wouterh
- @tdg5
- @jrmmnr
- @l3kn
- @rpellerin
- @sandbochs
- @wouterh
- @MattKunze

## License

The MIT License (MIT)

Copyright (c) 2020, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
