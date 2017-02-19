/**
 * Test suite uses mocha and enzyme to mock browser APIs
 * 
 * See Enzyme docs: 
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

var React = require('react');
var ReactQuill = require('../src/index');
var { mount } = require('enzyme');
var sinon = require('sinon');

describe('<ReactQuill />', function() {

  it('calls componentDidMount', function() {
    sinon.spy(ReactQuill.prototype, 'componentDidMount');
    const wrapper = mount(
      getTestNode()
    );
    expect(Foo.prototype.componentDidMount.calledOnce).to.equal(true);
  });

});

function getTestNode() {
  var editorHtml = '';
  return React.createElement(
    ReactQuill,
    {
      value: editorHtml
    },
    [
      React.DOM.div({
        key: "editor",
        ref: "editor",
        className: "quill-contents",
        dangerouslySetInnerHTML: { __html: editorHtml }
      }),
    ]
  );
}