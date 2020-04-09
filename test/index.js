/**
 * Test suite uses mocha and enzyme to mock browser APIs
 *
 * See Enzyme docs:
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

const React = require('react');
const sinon = require('sinon');
const ReactQuill = require('../lib/index');
const { Quill } = require('../lib/index');

const {
  mountReactQuill,
  getQuillInstance,
  getQuillContentsAsHTML,
  setQuillContentsFromHTML,
  withMockedConsole,
} = require('./utils');

console.log(
  '\n\
  Note that some functionality cannot be tested outside of a full browser environment.\n\n\
  To manually test the component:\n\
    1) Run "npm install" & "npm run build"\n\
    2) Open "demo/index.html" in a web browser.\
'
);

describe('<ReactQuill />', function() {
  it('calls componentDidMount', () => {
    sinon.spy(ReactQuill.prototype, 'componentDidMount');
    const wrapper = mountReactQuill();
    // @ts-ignore method injected by sinon spy
    expect(ReactQuill.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('allows props to be set', () => {
    const props = { readOnly: true };
    const wrapper = mountReactQuill(props);
    expect(wrapper.props().readOnly).to.equal(true);
    wrapper.setProps({ readOnly: false });
    expect(wrapper.props().readOnly).to.equal(false);
  });

  it('attaches a Quill instance to the component', () => {
    const wrapper = mountReactQuill();
    const quill = getQuillInstance(wrapper);
    expect(quill instanceof Quill).to.equal(true);
  });

  it('passes options to Quill from props', () => {
    const enabledFormats = ['underline', 'bold', 'italic'];
    const props = {
      placeholder: 'foobar',
      readOnly: true,
      formats: enabledFormats,
      modules: {
        toolbar: enabledFormats,
      },
    };
    const wrapper = mountReactQuill(props);
    const quill = getQuillInstance(wrapper);
    expect(quill.options.placeholder).to.equal(props.placeholder);
    expect(quill.options.readOnly).to.equal(props.readOnly);
    expect(quill.options.modules).to.include.keys(Object.keys(props.modules));
    expect(quill.options.formats).to.include.members(props.formats);
  });

  it('allows using HTML strings as value', () => {
    const html = '<p>Hello, world!</p>';
    const wrapper = mountReactQuill({ value: html });
    const quill = getQuillInstance(wrapper);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(html);
  });

  it('allows using HTML strings as defaultValue', () => {
    const html = '<p>Hello, world!</p>';
    const wrapper = mountReactQuill({ defaultValue: html });
    const quill = getQuillInstance(wrapper);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(html);
  });

  it('allows using Deltas as value', () => {
    const html = '<p>Hello, world!</p>';
    const delta = { ops: [{ insert: 'Hello, world!' }] };
    const wrapper = mountReactQuill({ value: html });
    const quill = getQuillInstance(wrapper);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(html);
  });

  it('prevents using Delta changesets from events as value', done => {
    const value = '<p>Hello, world!</p>';
    const changedValue = '<p>Adieu, world!</p>';
    let wrapper;
    const onChange = (_, delta) => {
      wrapper.setProps({ value: delta });
    };
    wrapper = mountReactQuill({ value, onChange });

    const expectedErr = /You are passing the `delta` object from the `onChange` event back/;
    // this test knows a lot about the implementation,
    // but we need to wrap the right function with a catch
    // in order to prevent errors from it from propagating
    const origValidateProps = wrapper.instance().validateProps;
    let calledDone = false; // might get called more than once
    wrapper.instance().validateProps = function(props) {
      try {
        origValidateProps.call(wrapper.instance(), props);
      } catch (err) {
        if (expectedErr.test(err) && calledDone === false) {
          done();
          calledDone = true;
        }
      }
    }.bind(wrapper.instance());

    setQuillContentsFromHTML(wrapper, changedValue);
  });

  it('allows using Deltas as defaultValue', () => {
    const html = '<p>Hello, world!</p>';
    const delta = { ops: [{ insert: 'Hello, world!' }] };
    const wrapper = mountReactQuill({ defaultValue: html });
    const quill = getQuillInstance(wrapper);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(html);
  });

  it('calls onChange with the new value when Quill calls pasteHTML', () => {
    const onChangeSpy = sinon.spy();
    const inHtml = '<p>Hello, world!</p>';
    const onChange = value => {
      expect(inHtml).to.equal(value);
      onChangeSpy();
    };
    const wrapper = mountReactQuill({ onChange });
    setQuillContentsFromHTML(wrapper, inHtml);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(inHtml);
    expect(onChangeSpy).to.have.property('callCount', 1);
  });

  it('calls onChange with the new value when Quill calls insertText', () => {
    const onChangeSpy = sinon.spy();
    const inHtml = '<p><strong>Hello, World!</strong></p>';
    const onChange = value => {
      expect(inHtml).to.equal(value);
      onChangeSpy();
    };
    const wrapper = mountReactQuill({ onChange });
    const quill = getQuillInstance(wrapper);
    quill.insertText(0, 'Hello, World!', 'bold', true);
    expect(getQuillContentsAsHTML(wrapper)).to.equal(inHtml);
    expect(onChangeSpy).to.have.property('callCount', 1);
  });

  it('shows defaultValue if value prop is undefined', () => {
    const defaultValue = '<p>Hello, world!</p>';
    const wrapper = mountReactQuill({ defaultValue });
    const quill = getQuillInstance(wrapper);
    // @ts-ignore untyped instance
    expect(wrapper.instance().getEditorContents()).to.equal(defaultValue);
  });

  it('shows the value prop instead of defaultValue if both are defined', () => {
    const defaultValue = '<p>Hello, world!</p>';
    const value = '<p>Good night, moon!</p>';
    const wrapper = mountReactQuill({
      defaultValue: defaultValue,
      value: value,
    });
    const quill = getQuillInstance(wrapper);
    // @ts-ignore untyped instance
    expect(wrapper.instance().getEditorContents()).to.equal(value);
  });

  it('uses a custom editing area if provided', () => {
    const div = React.createFactory('div');
    const editingArea = div({ id: 'venus' });
    const wrapper = mountReactQuill({}, editingArea);
    const quill = getQuillInstance(wrapper);
    expect(wrapper.getDOMNode().querySelector('div#venus')).not.to.be.null;
  });

  /**
   * This can't be tested with the current state of JSDOM.
   * The selection functions have been shimmed in this test suite,
   * but they  will not work until DOM traversal is implemented in
   * https://github.com/tmpvar/jsdom/issues/317.
   * Leaving this pending test as a reminder to follow up.
   */
  it('focuses editor when calling focus()');

  /**
   * A test for this may work if checking document.activeElement,
   * but chances are the focus was never removed from the body
   * after calling focus(). See JSDOM issue #317.
   */
  it('removes focus from the editor when calling blur()');

  /**
   * In a browser, querySelector('.ql-editor').textContent = 'hi' would
   * trigger a 'text-change' event, but here it doesn't. Is the polyfill
   * for MutationObserver not working?
   */
  it('calls onChange after the textContent of the editor changes');

  /**
   * This is hard to do without Selenium's 'type' function, but it is the
   * ultimate test of whether everything is working or not
   */
  it('calls onChange after keypresses are sent to the editor');
});
