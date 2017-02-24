/**
 * Test suite uses mocha and enzyme to mock browser APIs
 * 
 * See Enzyme docs: 
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

var React = require('react');
var ReactQuill = require('../src/index');
var Quill = ReactQuill.Quill;
var { mount, shallow } = require('enzyme');
var chai = require('chai');
var { expect, assert } = chai;
var chaiEnzyme = require('chai-enzyme');
var sinon = require('sinon');

chai.use(chaiEnzyme());

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

  describe('Quill instance', function() {

    it('is attached to the component', () => {
      const wrapper = mount(ReactQuillNode());
      const quill = getQuillFromEditorNode(wrapper);
      expect(quill instanceof Quill).to.equal(true)
    })

    it('receives options from props', () => {
      var enabledFormats = ['underline', 'bold', 'italic'];
      var props = {
        placeholder: 'foobar',
        readOnly: true,
        formats: enabledFormats,
        modules: {
          toolbar: enabledFormats,
        }
      }
      const wrapper = mount(ReactQuillNode(props));
      const quill = getQuillFromEditorNode(wrapper);
      expect(quill.options.placeholder).to.equal(props.placeholder)
      expect(quill.options.readOnly).to.equal(props.readOnly)
      expect(quill.options.modules).to.include.keys(Object.keys(props.modules))
      expect(quill.options.formats).to.include.members(props.formats)
    })

    it('sends a change event when the editor content changes') // tricky to simulate

    it('shows defaultValue by default if value prop is undefined') // hardcode expected HTML first

    it ('shows the value prop by default instead of defaultValue if both are defined') // ^same

    it('allows editor to be focused') // might be tricky without focus class

  })

  describe('Editor', function() {

    it('passes new html content to onChange handler when content changes')

  })

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

function getQuillFromEditorNode(wrapper) {
  return wrapper.get(0).getEditor();
}