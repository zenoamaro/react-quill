React-Quill ![](https://travis-ci.org/zenoamaro/react-quill.svg?branch=master)
==============================================================================

A [Quill] component for [React].

[Quill]: http://quilljs.com
[React]: http://facebook.github.io/react/

**Warning**: The project is still in alpha stage. Use with caution.

  1. [Quick start](#quick-start)
  2. [API reference](#api-reference)
  3. [Building and testing](#building-and-testing)
  4. [Changelog](#changelog)
  5. [License](#license)


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

2. Customize a few settings:

    ~~~jsx
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


API reference
-------------
`ReactQuill` accepts a few props:

`id`
: ID to be applied to the DOM element.

`className`
: Classes to be applied to the DOM element.

`value`
: Value for the editor as a controlled component.

`defaultValue`
: Initial value for the editor as an uncontrolled component.

`readOnly`
: If true, the editor won't allow changing its contents.

`toolbar`
: An object with custom configuration for the toolbar. Defaults are available as `ReactQuill.Toolbar.defaultItems` and `ReactQuill.Toolbar.defaultColors`. See the [Toolbar module](http://quilljs.com/docs/modules/toolbar/).

`formats`
: An array of formats to be enabled during editing. All implemented formats are enabled by default. See [Formats](http://quilljs.com/docs/formats/) for a list.

`styles`
: An object with custom CSS styles to be added to the editor. See [configuration](http://quilljs.com/docs/configuration/) for details.

`theme`
: The name of the theme to apply to the editor. Defaults to `base`.

`pollInterval`
: Interval in ms between checks for local changes in editor contents.

`onChange(value)`
: Called back with the new contents of the editor after change.


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
#### v0.0.4
- Added color toggle to toolbar (@chrismcv)
- Exporting default item sets on `QuillToolbar`
- Fixed `QuillComponent` only accepting a single child.

#### v0.0.3
- Switched from `quilljs` package to `quill`.
- Using the new `destroy()` from Quill.

#### v0.0.2
- Compatible with React 0.12.

#### v0.0.1
- Initial version.

[Full changelog](CHANGELOG.md)


Roadmap
-------
- [ ] Support updates in editor life-cycle
- [ ] First-class support for modules
- [ ] Better API for custom controls?
- [ ] Delta updates


License
-------
The MIT License (MIT)

Copyright (c) 2014, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.