React-Quill ![](https://travis-ci.org/zenoamaro/react-quill.svg?branch=master)
==============================================================================

A [Quill] component for [React].

See a [live demo].

[Quill]: https://quilljs.com
[React]: https://facebook.github.io/react/
[live demo]: https://zenoamaro.github.io/react-quill/

  1. [Quick start](#quick-start)
  2. [Styles and themes](#styles-and-themes)
  3. [Upgrading to React-Quill v1.0.0](#upgrading-to-react-quill-v1-0-0)
  4. [Bundling with Webpack](#bundling-with-webpack)
  5. [API reference](#api-reference)
  6. [Building and testing](#building-and-testing)
  7. [Changelog](#changelog)
  8. [License](#license)


Quick start
-----------
1. Use straight away:

    ~~~jsx
    var React = require('react');
    var ReactQuill = require('react-quill');

    var MyComponent = React.createClass({
      /* ... */

      render: function() {
        return (
          <ReactQuill value={this.state.value} />
        );
      }
    });
    ~~~

2. Bind to the `onChange` event and customize a few settings:

    ~~~jsx
    /*
    Include `quill.snow.css` to use the editor's standard theme. For example,
    depending on the structure of your app, you could do something like this:

    <link rel="stylesheet" href="../node_modules/react-quill/dist/quill.snow.css">
    */

    var MyComponent = React.createClass({
      /* ... */

      onTextChange: function(value) {
        this.setState({ text:value });
      },

      render: function() {
        return (
          <ReactQuill theme="snow"
                      value={this.state.text}
                      onChange={this.onTextChange} />
        );
      }
    });
    ~~~

3. Custom controls:

    ~~~jsx
    var MyComponent = React.createClass({
      /* ... */

      render: function() {
        return (
          <ReactQuill>
            <ReactQuill.Toolbar key="toolbar"
                                ref="toolbar"
                                items={ReactQuill.Toolbar.defaultItems} />
            <div key="editor"
                 ref="editor"
                 className="quill-contents"
                 dangerouslySetInnerHTML={{__html:this.getEditorContents()}} />
          </ReactQuill>
        );
      }
    });
    ~~~

### Using with Quill 1.0

If using Quill >1.0.0 as a dependency, the toolbar should be configured directly through the Quill module API rather than through the React-Quill wrapper. 

- Pass `toolbar={false}` as a prop to `ReactQuill` and remove the `ReactQuill.Toolbar` JSX element
- [Quill Toolbar Module Docs (Beta)](http://beta.quilljs.com/docs/modules/toolbar/)

#### Example

~~~jsx
var MyComponent = React.createClass({
  /* ... */

  _quillModules: {
      toolbar: [ 
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], 
          ['link', 'image'], 
          ['clean'] 
      ]
      /* ... other modules */
  },

  _quillFormats: [ 
      "header",
      "bold", "italic", "underline", "strike", "blockquote",
      "list", "bullet", "indent",
      "link", "image" 
  ],
  
  render: function() {
    return (
      <div className='_quill'>
        <ReactQuill theme='snow' 
                    modules={this._quillModules}
                    formats={this._quillFormats}
                    toolbar={false} // Let Quill manage toolbar
                    bounds={'._quill'}>
          <div key="editor"
                ref="editor"
                className="quill-contents border_solid_top"
                dangerouslySetInnerHTML={{__html:this.state.editorContent}} />
        </ReactQuill>
      </div>
    );
  }
});
~~~

4. Mixing in:

    ~~~jsx
    var MyComponent = React.createClass({
      mixins: [ ReactQuill.Mixin ],

      componentDidMount: function() {
        var editor = this.createEditor(
          this.getEditorElement(),
          this.getEditorConfig()
        );
        this.setState({ editor:editor });
      },

      componentWillReceiveProps: function(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.props.value) {
          this.setEditorContents(this.state.editor, nextProps.value);
        }
      },

      /* ... */
    });
    ~~~

    See [component.js](src/component.js) for a fully fleshed-out example.


Styles and themes
-----------------
The Quill editor supports themes.

It includes a full-fledged theme, called _snow_, that is Quill's standard appearance, and a _base_ theme containing only the bare essentials to allow modules like toolbars or tooltips to work.

These stylesheets can be found in the Quill distribution, but for convenience they are also linked among React Quill's `dist`s. In a common case you would activate a theme like this:

    <ReactQuill theme="snow" />

And then link the appropriate stylesheet:

    <link rel="stylesheet" href="../node_modules/react-quill/dist/quill.snow.css">

This may vary depending how application is structured, directories or otherwise. For example, if you use a CSS pre-processor like SASS, you may want to import that stylesheet inside your own.


Upgrading to React-Quill v1.0.0
-------------------------------
Please note that many [migration steps to Quill v1.0](http://quilljs.com/guides/upgrading-to-1-0/) may also apply.


### The `formats` property

Previously, it was possible to provide custom formats to the `formats` prop. [Use Parchment to provide new formats](https://github.com/quilljs/parchment) instead.

### The `styles` property

Previously, it was allowed to inject CSS styles by providing an object to the `styles` property. This option has been removed from Quill 1.0, and support for it in React Quill has gone as well. If you need to inject styles, link an external stylesheet instead.

See the [Quill Release Notes](http://quilljs.com/guides/upgrading-to-1-0/#configuration).

### The `pollInterval` property

This property previously set the frequency with which Quill polled the DOM for changes. It does not have any effect anymore, and can safely be removed from the props.


Bundling with Webpack
---------------------
Quill ships only a pre-built javascript file, so Webpack will complain:

~~~
Error: ./~/react-quill/~/quill/dist/quill.js
Critical dependencies:
6:478-485 This seems to be a pre-built javascript file. Though this is possible, it's not recommended. Try to require the original source to get better results.
@ ./~/react-quill/~/quill/dist/quill.js 6:478-485
~~~

The warning is harmless, but if you want to silence it you can avoid parsing Quill by adding this to your Webpack configuration:

~~~js
module: {
  // Shut off warnings about using pre-built javascript files
  // as Quill.js unfortunately ships one as its `main`.
  noParse: /node_modules\/quill\/dist/
}
~~~

See [#7](https://github.com/zenoamaro/react-quill/issues/7) for more details.


API reference
-------------

### Exports

`ReactQuill.Mixin`
: Provides the bridge between React and Quill. `ReactQuill` implements this mixin; in the same way you can use it to build your own component, or replace it to implement a new core for the default component.

`ReactQuill.Toolbar`
: The component that renders the basic ReactQuill toolbar. The default collection of items and color swatches is available as `ReactQuill.Toolbar.defaultItems` and `ReactQuill.Toolbar.defaultColors` respectively.

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

`modules`
: An object specifying what modules are enabled, and their configuration. See the [modules section](http://quilljs.com/docs/modules/) over the Quill documentation for more information on what modules are available.

`toolbar`
: A list of toolbar items to use as custom configuration for the toolbar. Pass `false` to disable the toolbar completely. Defaults items are available for reference in [`ReactQuill.Toolbar.defaultItems`](src/toolbar.js#L21) and [`ReactQuill.Toolbar.defaultColors`](src/toolbar.js#L6). See also the [Toolbar module](http://quilljs.com/docs/modules/toolbar/) over the Quill documentation for more information on the inner workings.

`formats`
: An array of formats to be enabled during editing. All implemented formats are enabled by default. See [Formats](http://quilljs.com/docs/formats/) for a list.
```

`style`
: An object with custom CSS rules to apply on the editor's container. Rules should be in React's "camelCased" naming style.

`theme`
: The name of the theme to apply to the editor. Defaults to `base`.

`bounds`
: Selector or DOM element used by Quill to constrain position of popups. Defaults to `document.body`.

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

If you have [a ref to a ReactQuill node](https://facebook.github.io/react/docs/more-about-refs.html), you will be able to invoke the following methods:

`focus()`
: Focuses the editor.

`blur()`
: Removes focus from the editor.

`getEditor()`
: Returns the Quill instance that backs the editor. While you can freely use this to access methods such as `getText()`, please avoid from imperatively manipulating the instance.


Building and testing
--------------------
You can run the automated test suite:

    $ npm test

And build a minificated version of the source:

    $ npm run build

More tasks are available on the [Makefile](Makefile):

    lint: lints the source
    spec: runs the test specs
    coverage: runs the code coverage test
    test: lint, spec and coverage threshold test
    build: builds the minified version


Changelog
---------
#### v0.4.1
- Added contents of `dist` to NPM package.

#### v0.4.0
This release finally adds support for React 0.14. ⚠️ Shims to support older versions of React have been removed.

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

#### v0.3.0
- Bumped Quill.js to v0.20.0
- Exposed `focus` and `blur` public methods from component.
- Exposed `getEditor` public method to retrieve the backing Quill instance from the component.
- Added callbacks for listening to keyboard events.
- Added tooltips for toolbar choice controls (@bird512).
- Added support for child nodes in toolbar items (@1000hz).
- Added support for custom formats in the configuration (@csk157).
- Added an option to disable the toolbar entirely by passing `false` to `toolbar`.
- Added an option to disable styles entirely by passing `false` to `style` (@kkerr1).
- Fixed an issue where the Quill would duplicate React IDs inside the toolbar leading to errors. Fixes #15.
- Fixes an issue where the editor could be used while null (@brucedlukens).
- Fixes an issue where null would be set on the editor. Fixes #48.
- Fixes an issue where the editor would be instantiated with the wrong value. Fixes #50.
- Avoiding parsing Quill's `dist` directory with webpack.

[Full changelog](CHANGELOG.md)


Roadmap
-------
- [ ] ES6 rewrite
- [x] React 0.14 support
- [ ] First-class support for modules
- [ ] Better API for custom controls
- [ ] Tests!


License
-------
The MIT License (MIT)

Copyright (c) 2016, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
