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

console.log('\n\
  Note that some functionality cannot be tested outside of a full browser environment.\n\n\
  To manually test the component:\n\
    1) Run "npm install" \& "npm run build"\n\
    2) Open "demo/index.html" in a web browser.\
')

describe('<ReactQuill />', function() {

  it('calls componentDidMount', () => {
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

  it('attaches a Quill instance to the component', () => {
    const wrapper = mount(ReactQuillNode());
    const quill = wrapper.getNode().getEditor();
    expect(quill instanceof Quill).to.equal(true)
  })

  it('passes options to Quill from props', () => {
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
    const quill = wrapper.getNode().getEditor();
    expect(quill.options.placeholder).to.equal(props.placeholder)
    expect(quill.options.readOnly).to.equal(props.readOnly)
    expect(quill.options.modules).to.include.keys(Object.keys(props.modules))
    expect(quill.options.formats).to.include.members(props.formats)
  })

  it('calls onChange with the new value when Quill calls pasteHTML', () => {
    const onChangeSpy = sinon.spy();
    const inHtml = '<p>Hello, world!</p>';
    const onChange = (value) => {
      expect(inHtml).to.equal(value)
      onChangeSpy();
    }
    const wrapper = mount(ReactQuillNode({
      onChange: onChange,
    }));
    wrapper.getNode().getEditor().clipboard.dangerouslyPasteHTML(inHtml)
    expect(wrapper.getDOMNode().querySelector('.ql-editor').innerHTML).to.equal(inHtml)
    expect(onChangeSpy).to.have.property('callCount', 1);
  })

  it('calls onChange with the new value when Quill calls insertText', () => {
    const onChangeSpy = sinon.spy();
    const inHtml = '<p><strong>Hello, World!</strong></p>';
    const onChange = (value) => {
      expect(inHtml).to.equal(value)
      onChangeSpy();
    }
    const wrapper = mount(ReactQuillNode({
      onChange: onChange,
    }));
    wrapper.getNode().getEditor().insertText(0, 'Hello, World!', 'bold', true);
    expect(wrapper.getDOMNode().querySelector('.ql-editor').innerHTML).to.equal(inHtml)
    expect(onChangeSpy).to.have.property('callCount', 1);
  })

  it('shows defaultValue if value prop is undefined', () => {
    const defaultValue = '<p>Hello, world!</p>';
    const wrapper = mount(ReactQuillNode({
      defaultValue: defaultValue,
    }));
    const quill = wrapper.getNode().getEditor();
    expect(wrapper.getNode().getEditorContents()).to.equal(defaultValue)
  })

  it('shows the value prop instead of defaultValue if both are defined', () => {
    const defaultValue = '<p>Hello, world!</p>';
    const value = '<p>Good night, moon!</p>';
    const wrapper = mount(ReactQuillNode({
      defaultValue: defaultValue,
      value: value,
    }));
    const quill = wrapper.getNode().getEditor();
    expect(wrapper.getNode().getEditorContents()).to.equal(value)
  })

  it('uses a custom editing area if provided', () => {
    const editingArea = React.DOM.div({id:'venus'});
    const wrapper = mount(ReactQuillNode({}, editingArea));
    const quill = wrapper.getNode().getEditor();
    expect(wrapper.getDOMNode().querySelector('div#venus')).not.to.be.null;
  })

  /**
   * This can't be tested with the current state of JSDOM. 
   * The selection functions have been shimmed in this test suite, 
   * but they  will not work until DOM traversal is implemented in 
   * https://github.com/tmpvar/jsdom/issues/317.
   * Leaving this pending test as a reminder to follow up.
   */
  it('focuses editor when calling focus()')

  /**
   * A test for this may work if checking document.activeElement,
   * but chances are the focus was never removed from the body
   * after calling focus(). See JSDOM issue #317.
   */
  it('removes focus from the editor when calling blur()')

  /**
   * In a browser, querySelector('.ql-editor').textContent = 'hi' would 
   * trigger a 'text-change' event, but here it doesn't. Is the polyfill
   * for MutationObserver not working?
   */
  it('calls onChange after the textContent of the editor changes')

  /**
   * This is hard to do without Selenium's 'type' function, but it is the 
   * ultimate test of whether everything is working or not
   */
  it('calls onChange after keypresses are sent to the editor')

});

function ReactQuillNode(props, children) {
  props = Object.assign({
    modules: {'toolbar': ['underline', 'bold', 'italic']},
    formats: ['underline', 'bold', 'italic']
  }, props);
  
  return React.createElement(
    ReactQuill,
    props,
    children
  );
}