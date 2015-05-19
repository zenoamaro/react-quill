Changelog
=========

v0.1.1
------
- The pre-compiled distributable is not shipped with the NPM package anymore. Should fix [#2](https://github.com/zenoamaro/react-quill/issues/2).
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