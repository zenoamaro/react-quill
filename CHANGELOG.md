Changelog
=========

Next
----

- Fully ported to TypeScript (#549)
- Fully React16 compliant (#549)
- Removed Mixin (#549)
- Removed Toolbar (#549)

v1.3.4
------

- Bump Quill to 1.3.7 to close a security vulnerability (#575)

v1.3.3
------

- Pin Quill types version (#420 @daggmano)

v1.3.2
------

- Add preserveWhitespace prop (#407 @royshouvik)

v1.3.1
------

- Add back default export (#374, #384 one19)

v1.3.0
------

- Add scrollingContainer prop
- Fix Typescript exports
- Fix tabindex prop

v1.2.6
------

Replaced React.DOM with react-dom-factories (#319 thienanle)

v1.2.5
------

- Fix issue with unnecessary editor focus on mount (#321 jetzhou)
- Switch to Quill's clipboard.convert from the paste API that now grabs focus automatically

v1.2.4
------

- Only restore focus if editor had focus (#312 @MattKunze)


v1.2.2
------

- Add Typescript definitions (#277 @Charrondev)
- Fixes for TS definitions  (#294 @jdhungtington, #296 @ajaska)

v1.1.0
------

- Add support for React 16 and onwards by depending on `prop-types` and `create-react-class` (#181 @mikecousins)
- Allow setting contents with a Quill Delta via the `value` prop (#101)
- Add onFocus/onBlur props (#110)
- Add tabindex support (#232)

v1.0.0
------
This release supports Quill v1.0.0+. ⚠️ There are many breaking changes, so refer to the documentation for information on how to migrate your application.

- Updated to support Quill v1.0.0+ (@clemmy, @alexkrolick)
- Bundling Quill with ReactQuill (@clemmy)
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
- Fixed issue where changing props caused re-render artifacts (#147)
- Fixed bounds validation in setEditorSelection (@wouterh)
- Updated README.md to reference core.css instead of base.css (@sandbochs)
- Updated React peerDependency (@rpellerin)
- Removed inline Parchment formats for font-size and font-family (#217)

v0.4.1
------
- Added contents of `dist` to NPM package.

v0.4.0
------
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
