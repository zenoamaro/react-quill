/**
 * Test suite uses mocha and enzyme to mock browser APIs
 * 
 * See Enzyme docs: 
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

var React = require('react');
var ReactQuill = require('../src/index');
var { mount, shallow } = require('enzyme');
var { expect } = require('chai');
var sinon = require('sinon');

describe('<ReactQuill />', function() {

  it('calls componentDidMount', function() {
    sinon.spy(ReactQuill.prototype, 'componentDidMount');
    const wrapper = mount(ReactQuillNode());
    expect(ReactQuill.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('allows props to be set', () => {
    var props = {foo: 'bar'}
    const wrapper = mount(ReactQuillNode(props));
    expect(wrapper.props().foo).to.equal('bar');
    wrapper.setProps({ foo: 'baz' });
    expect(wrapper.props().foo).to.equal('baz');
  });

  it('sends a change event when the editor content changes');

  it('blocks changes when disabled')

  it('shows placeholder when empty')

  it('allows editor to be focused')

});

function ReactQuillNode(props, html) {
  html = html || '';
  props = props || {};
  Object.assign(props, {
    modules: {'toolbar': ['underline', 'bold', 'italic']},
    formats: ['underline', 'bold', 'italic']
  })
  return React.createElement(
    ReactQuill,
    props,
    [
      React.DOM.div({
        key: "editor",
        ref: "editor",
        className: "quill-contents",
        dangerouslySetInnerHTML: { __html: html }
      }),
    ]
  );
}