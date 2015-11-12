Changelog
=========

v0.3.0
------
- Bumped Quill.js to v0.2.0
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

v0.2.2
------
- Added missing `modules` propType and documentation.
- Children are now cloned so ReactQuill can own their refs. Fixes #20.

v0.2.1
------
- Link toolbar button and module are now enabled by default. Fixes #19.

v0.2.0
------
- Fix React warnings about unique `key` props in toolbar (@Janekk).
- Sending `delta` and `source` from editor change events. Fixes #17.
- Rewritten uncontrolled and semi-controlled operation. Should fix #9, #10 and #14.
- Editor props can now be changed after mounting.
- Added callback for selection change event. Closes #12.

v0.1.1
------
- The pre-compiled distributable is not shipped with the NPM package anymore. Should fix #2.
- Sourcemaps are now emitted for both distributables, as separate files.
- Avoiding parsing Quill as it ships with a pre-built main.

v0.1.0
------
- Added support for toolbar separators.
- Added support for font family selectors.
- Updated the default toolbar to match Quill's.
- Updated Quill to v0.19.12.

v0.0.6
------
- Added keywords for inclusion in [React.parts](https://react.parts).

v0.0.5
------
- Default empty content for components with no value.
- Fixes wrong `QuillToolbar` propType.

v0.0.4
------
- Added color toggle to toolbar (@chrismcv)
- Exporting default item sets on `QuillToolbar`
- Fixed `QuillComponent` only accepting a single child.

v0.0.3
------
- Switched from `quilljs` package to `quill`.
- Using the new `destroy()` from Quill.

v0.0.2
------
- Compatible with React 0.12.

v0.0.1
------
- Initial version.
