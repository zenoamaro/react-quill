React-Quill [![Build Status](https://travis-ci.org/zenoamaro/react-quill.svg?branch=master)](https://travis-ci.org/zenoamaro/react-quill)
==============================================================================

A [Quill] component for [React].

See a [live demo] or [Codepen](http://codepen.io/alexkrolick/pen/xgyOXQ/left?editors=0010#0).

[Quill]: https://quilljs.com
[React]: https://facebook.github.io/react/
[live demo]: https://zenoamaro.github.io/react-quill/

  1. [Quick start](#quick-start)
  1. [Advanced Options](#advanced-options)
    1. [Theme](#theme)
    1. [Custom Toolbar](#custom-toolbar)
    1. [Custom Formats](#custom-formats)
    1. [Mixin](#mixin)
  1. [Upgrading to React-Quill v1.0.0](#upgrading-to-react-quill-v100)
  1. [API reference](#api-reference)
  1. [Browser support](#browser-support)
  1. [Building and testing](#building-and-testing)
    1. [Bundling with Webpack](#bundling-with-webpack)
  1. [Changelog](#changelog)
  1. [Contributors](#contributors)
  1. [License](#license)

---

💯 **React Quill now supports Quill v1.0.0!**  
Thanks to @clemmy and @alexkrolick for landing this much-awaited change. There are many breaking changes, so be sure to read the [migration guide](#upgrading-to-react-quill-v100).
 
---

🎧 **Latest published package version: `v1.0.0-beta-1`**  
Follow React Quill's development on the beta channel leading to `v1.0.0`.
 
---

🏵 **Welcoming @alexkrolick to the team!**  
His contributions have been incredible so far, and his passion and dedication will bring some much-deserved love to this project. 

---


## Quick Start

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' }
  }

  handleChange(value) {
    this.setState({ text: value })
  }

  render() {
    return (
      <ReactQuill value={this.state.text}
                  onChange={this.handleChange} />
    )
  }
}
```

## Advanced Options

### Theme

The Quill editor supports [themes](http://quilljs.com/docs/themes/). It includes a full-fledged theme, called _snow_, that is Quill's standard appearance, a _bubble_ theme that is similar to the inline editor on Medium, and a _base_ theme containing only the bare essentials to allow modules like toolbars or tooltips to work.

These stylesheets can be found in the Quill distribution, but for convenience they are also linked in React Quill's `dist` folder. In a common case you would activate a theme by setting the theme [prop](#props) like this:

```jsx
<ReactQuill theme="snow" /> // or "bubble", "base"
```

And then link the appropriate stylesheet (only link the CSS for the themes you want to use):

```html
<link rel="stylesheet" href="node_modules/react-quill/dist/quill.snow.css">
<link rel="stylesheet" href="node_modules/react-quill/dist/quill.bubble.css">
<link rel="stylesheet" href="node_modules/react-quill/dist/quill.base.css">

```

This may vary depending how application is structured, directories or otherwise. For example, if you use a CSS pre-processor like SASS, you may want to import that stylesheet inside your own.

### Custom Toolbar

#### Default Toolbar Elements

The [Quill Toolbar Module](http://quilljs.com/docs/modules/toolbar/) API provides an easy way to configure the default toolbar icons using an array of format names.

<details>
```jsx
var MyComponent = React.createClass({

  modules: {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  },

  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ],

  render: function() {
    return (
      <div className="text-editor">
        <ReactQuill theme="snow"
                    modules={this.modules}
                    formats={this.formats}>
          <div key="editor"
                ref="editor"
                className="quill-contents my-class-name"
                dangerouslySetInnerHTML={{__html:this.state.editorContent}}/>
        </ReactQuill>
      </div>
    );
  },

});
```
</details>

#### HTML Toolbar

You can also supply your own HTML/JSX toolbar with custom elements that are not part of the Quill theme.

<details>
See this example live on Codepen: [Custom Toolbar Example](https://codepen.io/alexkrolick/pen/gmroPj?editors=0010)
```jsx
/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const CustomButton = () => <span className="octicon octicon-star" />

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar () {
  const cursorPosition = this.quill.getSelection().index
  this.quill.insertText(cursorPosition, "★")
  this.quill.setSelection(cursorPosition + 1)
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header">
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
)

/* 
 * Editor component with custom toolbar and content containers
 */
class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = { editorHtml: '' }
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange (html) {
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
        >
          <div 
            key="editor"                     
            ref="editor"
            className="quill-contents"                     
            dangerouslySetInnerHTML={{__html:this.state.editorHtml}}
          />
        </ReactQuill>
      </div>
    )
  }
}

/* 
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      "insertStar": insertStar,
    }
  }
}

/* 
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color',
]

/* 
 * PropType validation
 */
Editor.propTypes = {
  placeholder: React.PropTypes.string,
}

/* 
 * Render component on page
 */
ReactDOM.render(
  <Editor placeholder={'Write something or insert a star ★'}/>, 
  document.querySelector('.app')
)
```
</details>

### Custom Formats

The component has two types of formats: 

1. The default [Quill formats](http://quilljs.com/docs/formats/) that are enabled/disabled using the [`formats` prop](#props). All formats are enabled by default.
2. Custom formats created using Parchment and registered with your component's Quill instance

<details>
<summary>Expand custom format example</summary>
ES6 Import
```js
import ReactQuill, { Quill } from 'react-quill'
```

CommonJS Require
```js
var ReactQuill = require('react-quill'); 
var Quill = ReactQuill.Quill;
```

```jsx
/*
 * Example Parchment format from 
 * https://quilljs.com/guides/cloning-medium-with-parchment/
 */
let Inline = Quill.import('blots/inline');
class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';
Quill.register(BoldBlot);

/*
 * Editor component with default and custom formats
 */
class MyComponent extends React.Component {
  constructor(props) {
    this.formats = ['italic, 'underline'] // default formats
    this.state = { text: '' }
  }
  
  handleChange(value) {
    this.setState({text: value})
  }
  
  render() {
    return (
      <ReactQuill 
        value={this.state.text}
        onChange={this.handleChange}
        formats={this.formats} // the custom format is already registered
      />
    )
  }
}
```
</details>

### Custom editing area

If you instantiate ReactQuill without children, it will create a `<div>` for you, to be used as the editing area for Quill. If you prefer, you can specify your own element for ReactQuill to use.

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

### Mixin

The module exports a mixin which can be used to create custom editor components. (Note that mixins will be deprecated in a future version of React).

<details>
```jsx
import {Mixin} from 'react-quill'
The ReactQuill default component is built using the mixin. See [component.js](src/component.js) for source.

var MyComponent = React.createClass({
  mixins: [ ReactQuill.Mixin ],

  componentDidMount: function() {
    var editor = this.createEditor(
      this.getEditingArea(),
      this.getEditorConfig()
    );
    this.setState({ editor:editor });
  },

  componentWillReceiveProps: function(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setEditorContents(this.state.editor, nextProps.value);
    }
  },

});
```
</details>

## Upgrading to React-Quill v1.0.0

Please note that many [migration steps to Quill v1.0](http://quilljs.com/guides/upgrading-to-1-0/) may also apply.

<details>
<summary>Expand upgrade guide</summary>

### The toolbar module

With v1.0.0, Quill adopted a new [toolbar configuration format](https://quilljs.com/docs/modules/toolbar/), to which React Quill will delegates all toolbar functionality, and which is now the preferred way to customize the toolbar.

Previously, toolbar properties could be set by passing a `toolbar` prop to React Quill. Pass the same options as `modules.toolbar` instead.
<details>
~~~diff
+ modules: {
    toolbar: [
       ...
    ],
+ },
  
  <ReactQuill
-   toolbar={this.toolbar}
+   modules={this.modules}
  />
~~~

If you used to provide your own HTML toolbar component, you can still do the same:

~~~diff
+ modules: {
+   toolbar: '#my-toolbar-component',
+ },
  
  <ReactQuill
-   toolbar="#my-toolbar-component"
+   modules={this.modules}
  />
~~~

Note that it is not possible to pass a toolbar component as a child to ReactQuill anymore.

Previously, React Quill would create a custom HTML toolbar for you if you passed a configuration object as the `toolbar` prop. This will not happen anymore. You can still create a `ReactQuill.Toolbar` explicitly:

~~~diff
+ modules: {
+   toolbar: '#my-quill-toolbar',
+ },

+ <ReactQuill.Toolbar
+   id='my-quill-toolbar'
+   items={this.oldStyleToolbarItems}
+ />

  <ReactQuill
-   toolbar={this.oldStyleToolbarItems}
+   modules={this.modules}
  />
~~~

However, consider switching to the new Quill format instead, or provide your own [toolbar component](#html-toolbar).

React Quill now follows the Quill toolbar format closely. See the [Quill toolbar documentation](https://quilljs.com/docs/modules/toolbar/) for a complete reference on all supported options.
</details>

### Adding custom formats with the `formats` property is deprecated

As of 1.0.0, [use Parchment to define new formats](https://github.com/quilljs/parchment). Use the [Quill export](#exports) from the module to register and extend formats:

```js
Quill.register('formats/CustomFormat', MyCustomFormat);
```

### The `styles` property

Previously, it was allowed to inject CSS styles by providing an object to the `styles` property. This option has been removed from Quill 1.0, and support for it in React Quill has gone as well. If you need to inject styles, link an external stylesheet instead.

See the [Quill Release Notes](http://quilljs.com/guides/upgrading-to-1-0/#configuration).

### The `pollInterval` property

This property previously set the frequency with which Quill polled the DOM for changes. It does not have any effect anymore, and can safely be removed from the props.

</details>

## API reference

### Exports

`ReactQuill.Mixin`
: Provides the bridge between React and Quill. `ReactQuill` implements this mixin; in the same way you can use it to build your own component, or replace it to implement a new core for the default component.

`ReactQuill.Toolbar`
: The component that renders the custom ReactQuill toolbar. The default collection of items and color swatches is available as `ReactQuill.Toolbar.defaultItems` and `ReactQuill.Toolbar.defaultColors` respectively. ⚠️ The Toolbar component is deprecated since v1.0.0. See [upgrading to React Quill v1.0.0](#upgrading-to-react-quill-v1-0-0).

`ReactQuill.Quill`
: The `Quill` namespace on which you can call `registerModule` and such.


### Props

`id`
: ID to be applied to the DOM element.

`className`
: Classes to be applied to the DOM element.

`value`
: Value for the editor as a controlled component. Note that due to limitations in Quill, this is actually a _semi-controlled_ mode, meaning that the edit is not prevented, but changing `value` will still replace the contents.

`defaultValue`
: Initial value for the editor as an uncontrolled component.

`readOnly`
: If true, the editor won't allow changing its contents.

`placeholder`
: The default value for the empty editor.

`modules`
: An object specifying which modules are enabled, and their configuration. The editor toolbar is a commonly customized module. See the [modules section](http://quilljs.com/docs/modules/) over the Quill documentation for more information on what modules are available.

`formats`
: An array of formats to be enabled during editing. All implemented formats are enabled by default. See [Formats](http://quilljs.com/docs/formats/) for a list. 
  Custom formats should not be included in the array as of version 1.0.0. Instead they should be created through [Parchment](https://github.com/quilljs/parchment) and registered with the module's [Quill export](#exports).

`style`
: An object with custom CSS rules to apply on the editor's container. Rules should be in React's "camelCased" naming style.

`theme`
: The name of the theme to apply to the editor. Defaults to `base`.

`bounds`
: Selector or DOM element used by Quill to constrain position of popups. Defaults to `document.body`.

`children`
: A single React element that will be used as the editing area for Quill in place of the default, which is a `<div>`. Note that you cannot use a `<textarea>`, as it is not a supported target. Note also that updating children is costly, as it will cause the Quill editor to be recreated. Use value if you want to control the html contents of the editor.

`onChange(content, delta, source, editor)`
: Called back with the new contents of the editor after change. It will be passed the HTML contents of the editor, a delta object expressing the change-set itself, the source of the change, and finally a read-only proxy to editor accessors such as `getText()`.

`onChangeSelection(range, source, editor)`
: Called back with the new selected range, or null when unfocused. It will be passed the selection range, the source of the change, and finally a read-only proxy to editor accessors such as `getBounds()`.

`onKeyPress(event)`
: Called after a key has been pressed and released.
: Note that, like its native counterpart, this won't be called for special keys such as <kbd>shift</kbd> or <kbd>enter</kbd>. If you need those, hook onto `onKeyDown` or `onKeyUp`.

`onKeyDown(event)`
: Called after a key has been pressed, but before it is released.
: Note that, due to how Quill works, it's possible that you won't receive events for keys such as <kbd>enter</kbd>, <kbd>backspace</kbd> or <kbd>delete</kbd>. If that's the case, try hooking onto `onKeyUp` instead.

`onKeyUp(event)`
: Called after a key has been released.


### Methods

If you have [a ref to a ReactQuill node](https://facebook.github.io/react/docs/more-about-refs.html) ([Codepen example](https://codepen.io/alexkrolick/pen/YNmGar?editors=0011)), you will be able to invoke the following methods:

`focus()`
: Focuses the editor.

`blur()`
: Removes focus from the editor.

`getEditor()`
: Returns the Quill instance that backs the editor. While you can freely use this to access methods such as `getText()`, please avoid from imperatively manipulating the instance.


## Building and testing

You can run the automated test suite:

```sh
npm test
```

And build a minificated version of the source:

```sh
npm run build
```

More tasks are available on the [Makefile](Makefile):

    lint: lints the source
    spec: runs the test specs
    coverage: runs the code coverage test
    test: lint, spec and coverage threshold test
    build: builds the minified version

Note that `dist` is ignored in the git repository as of version 1.0.0. If you need to use the built files without downloading the package from NPM, you can run the build tasks yourself or use a CDN like [unpkg](https://unpkg.com/react-quill@1.0.0-beta-1/dist/react-quill.min.js).

### Bundling with Webpack

Quill ships only a pre-built javascript file, so Webpack will complain after building a bundle:

```
Error: ./~/react-quill/~/quill/dist/quill.js
Critical dependencies:
6:478-485 This seems to be a pre-built javascript file. Though this is possible, it's not recommended. Try to require the original source to get better results.
@ ./~/react-quill/~/quill/dist/quill.js 6:478-485
```

The warning is harmless, but if you want to silence it you can avoid parsing Quill by adding this to your Webpack configuration:

```js
module: {
  // Shut off warnings about using pre-built javascript files
  // as Quill.js unfortunately ships one as its `main`.
  noParse: /node_modules\/quill\/dist/
}
```

See [#7](https://github.com/zenoamaro/react-quill/issues/7) for more details.

## Browser support

Please check the browser support table for the upstream [Quill](https://github.com/quilljs/quill) dependency. The React part of the codebase is ES5-compatible.

## Changelog

#### v1.0.0
This release adds support for Quill v1.0.0+. ⚠️ There are many breaking changes, both in Quill and in ReactQuill. See [Upgrading to React-Quill v1.0.0](#upgrading-to-react-quill-v100).

- Updated to support Quill v1.0.0+ (@clemmy, @alexkrolick)
- Bundling Quill with ReactQuill (@clemmy)
- Bundling CSS files in the NPM package
- Removed `dist` from source control (@alexkrolick)
- Deprecated `toolbar` property and component
- Deprecated the `styles` property
- Deprecated custom formats via the `formats` property
- Deprecated the `pollInterval` property
- Rerendering on `style` property change (@lavrton)
- Improved docs for `bounds`, which now rerenders on change
- Performing deep props comparison to avoid rerenders
- Fixed the unprivileged editor not returning values
- Restoring selection event after text change
- Fixed the order of parameters in change events (@webcarrot)
- Using 'core' instead of 'base' CSS (@alexkrolick)
- Added support for the `placeholder` property (@alexkrolick)
- Enable/disable editor using top-level Quill API (@alexkrolick)
- Prevent whitespace issues when initializing the editor (@bobrafie)
- Using buttons instead of spans for toolbar actions (@clemmy)
- Removed getHtml from unprivileged editor (@clemmy)
- Fixed calculations for range fields (@clemmy)
- Removed deprecated destroy functionality (@clemmy)
- Added return statement to proxy editor methods (@druti)
- Inline styles support for Quill Toolbar (@e-jigsaw)
- Fixed custom font size definitions (@clemmy)
- Support for bullet and ordered lists in toolbar (@clemmy)
- Updated the toolbar alignment section (@clemmy)
- Updated rendering of toolbar actions (@clemmy)
- Improved toolbar renderChoices implementation (@zhang-z)
- Fixed use of `defaultValue` in Toolbar selects
- Fixed bounds validation in setEditorSelection (@wouterh)
- Exposed Quill in exports (@tdg5)
- Added unhook function to clean up event listeners on unmount (@alexkrolick, @jrmmnr)
- Fixed documentation typos (@l3kn)
- Started testing with Enzyme (@alexkrolick)

#### v0.4.1
- Added contents of `dist` to NPM package.

#### v0.4.0
This release adds support for React 0.14. ⚠️ Shims to support older versions of React have been removed.

- React 0.14 support (@jacktrades, #49)
- Removed shims for React 0.12 and 0.13
- Bumped Quill.js to v0.20.1
- _Normal_ and _smaller_ sizes are not swapped anymore. (#63)
- Various toolbar choice items are now correctly ordered.
- Added image tooltips to the default set of modules (@kairxa, #54)
- Fixed extra white-space in classnames (@asiniy, #67)
- Published the Quill namespace on ReactQuill (@Sajam, #60)
- Quill stylesheets are now linked to `dist/` for convenience. (#70)
- Exposed editor accessor methods in change events. (#33)

[Full changelog](CHANGELOG.md)


## Contributors

React Quill would not be where it is today without the contributions of many people, which we are incredibly grateful for:
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

## Roadmap

- [x] React 0.14 support
- [x] Quill v1.0.0+ support
- [x] Tests!
- [ ] ES6 rewrite


## License

The MIT License (MIT)

Copyright (c) 2016, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
