React-Quill ![](https://travis-ci.org/zenoamaro/react-quill.svg?branch=master)
==============================================================================

A [Quill] component for [React].

See the [live demo].

[Quill]: https://quilljs.com
[React]: https://facebook.github.io/react/
[live demo]: https://zenoamaro.github.io/react-quill/

  1. [Quick start](#quick-start)
  2. [Bundling with Webpack](#bundling-with-webpack)
  3. [API reference](#api-reference)
  4. [Building and testing](#building-and-testing)
  5. [Changelog](#changelog)
  6. [License](#license)


Quick start
-----------
1. Use straight away:

    ~~~jsx
    /*
    Include `quill.base.css` to give the editor some basic styles it needs.
    You can find the _base_ theme in the quill distribution or inside
    `node_modules`.
    */

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

2. Customize a few settings:

    ~~~jsx
    /*
    Include a theme like `quill.snow.css` and activate it in the
    configuration like shown below. You can find the _snow_ theme in the
    quill distribution or inside `node_modules`.
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
: A list of toolbar items to use as custom configuration for the toolbar. Defaults (that also double as reference) are available as [`ReactQuill.Toolbar.defaultItems`](src/toolbar.js#L21) and [`ReactQuill.Toolbar.defaultColors`](src/toolbar.js#L6). See also the [Toolbar module](http://quilljs.com/docs/modules/toolbar/) over the Quill documentation for more information on the inner workings.

`formats`
: An array of formats to be enabled during editing. All implemented formats are enabled by default. See [Formats](http://quilljs.com/docs/formats/) for a list. Also accepts definitions of custom formats:
```javascript
[
  "list",
  "bullet",
  "bold",
  "italic",
  { name: "h1", tag: "H1", prepare: "heading", type: "line" },
  { name: "h2", tag: "H2", prepare: "heading", type: "line" },
  { name: "h3", tag: "H3", prepare: "heading", type: "line" }
];
```

`style`
: An object with custom CSS rules to apply on the editor's container. Rules should be in React's "camelCased" naming style.

`styles`
: An object with custom CSS selectors and rules to add to the editor. Neither should be in "camelCased" style. Pass `false` to prevent Quill from injecting any default style. See [configuration](http://quilljs.com/docs/configuration/) for details.

`theme`
: The name of the theme to apply to the editor. Defaults to `base`.

`pollInterval`
: Interval in ms between checks for local changes in editor contents.

`onChange(value, delta, source)`
: Called back with the new contents of the editor after change.

`onChangeSelection(range, source)`
: Called back with the new selected range, or null when unfocused.

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
#### v0.2.2
- Added missing `modules` propType and documentation.
- Children are now cloned so ReactQuill can own their refs. Fixes #20.

#### v0.2.1
- Link toolbar button and module are now enabled by default. Fixes #19.

#### v0.2.0
- Fix React warnings about unique `key` props in toolbar (@Janekk).
- Sending `delta` and `source` from editor change events. Fixes #17.
- Rewritten uncontrolled and semi-controlled operation. Should fix #9, #10 and #14.
- Editor props can now be changed after mounting.
- Added callback for selection change event. Closes #12.

[Full changelog](CHANGELOG.md)


Roadmap
-------
- [ ] First-class support for modules
- [ ] Better API for custom controls?


License
-------
The MIT License (MIT)

Copyright (c) 2015, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
