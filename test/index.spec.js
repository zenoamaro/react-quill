// load Cypress TypeScript definitions for IntelliSense
/// <reference types="cypress" />

import React from "react";
import ReactDOM from "react-dom";
import Quill from "quill";
import ReactQuill from "../lib";

Cypress.Commands.add("renderWithProps", (props = {}) => {
  return cy.window().then(w => {
    const target = w.document.getElementById("app");
    function TestHarness() {
      const [editorProps, setEditorProps] = React.useState(props);
      w.setProps = setEditorProps;
      w.editorRef = React.useRef();
      return <ReactQuill {...editorProps} ref={w.editorRef} />;
    }
    ReactDOM.render(<TestHarness />, target);
  });
});

Cypress.Commands.add("setProps", (props = {}) => {
  return cy.window().then(window => {
    // Hook into function provided by test harness:
    window.setProps(props);
  });
});

// Returns the editor contenteditable node
Cypress.Commands.add("getEditor", () => {
  return cy.get(".ql-editor");
});

// Returns a reference to the editor react element
Cypress.Commands.add("getEditorRef", () =>
  cy.window().then(w => w.editorRef.current)
);

describe("<ReactQuill />", () => {
  beforeEach(() => {
    cy.visit("/test.html");
  });

  it("can type in editor", function() {
    cy.renderWithProps({});
    cy.getEditor()
      .type("hello world\n\nfoo bar")
      .should("contain", "hello world")
      .should("contain", "foo bar");
  });

  it("can set value with HTML string", function() {
    const text = "Hello, world";
    cy.renderWithProps({
      value: `<p>${text}</p>`
    });
    cy.getEditor().should("contain", text);
  });

  it("can set value with Quill delta", function() {
    const text = "Hello, world";
    const delta = { ops: [{ insert: text }] };
    cy.renderWithProps({
      value: delta
    });
    cy.getEditor().should("contain", text);
  });

  it("allows using Deltas as defaultValue", () => {
    const text = "Hello, world";
    const delta = { ops: [{ insert: text }] };
    cy.renderWithProps({
      defaultValue: delta
    });
    cy.getEditor().should("contain", text);
  });

  it("cannot type in read-only editor", function() {
    cy.renderWithProps({ readOnly: true });
    cy.getEditor().should("have.attr", "contenteditable", "false");
  });

  it("preserves content when switching to read-only mode", function() {
    cy.renderWithProps({});
    cy.getEditor().as("editor");
    cy.get("@editor")
      .type("some text")
      .should("contain", "some text");
    cy.setProps({ readOnly: true });
    cy.get("@editor").should("contain", "some text");
  });

  it("calls onChange after typing", () => {
    const props = {
      onChange: (_, delta) => {},
      value: "<p>Hello, world</p>"
    };
    cy.spy(props, "onChange");
    cy.renderWithProps(props);
    cy.getEditor()
      .type("!!!")
      .then(() => {
        expect(props.onChange).to.be.called;
      });
  });

  it("can imperatively focus and blur using ref .blur() and .focus()", () => {
    cy.renderWithProps();
    cy.getEditor()
      .type("hello")
      .then(editor => {
        cy.getEditorRef().then(reactquill => {
          reactquill.blur();
          expect(editor).to.not.be.focused;
          reactquill.focus();
          expect(editor).to.be.focused;
        });
      });
  });

  it("can access underlying Quill instance using ref .getEditor()", () => {
    cy.renderWithProps();
    cy.getEditorRef().then(reactquill => {
      expect(reactquill.getEditor()).to.be.instanceOf(Quill);
    });
  });

  it("passes options to Quill from props", () => {
    const enabledFormats = ["underline", "bold", "italic"];
    const props = {
      placeholder: "foobar",
      readOnly: true,
      formats: enabledFormats,
      modules: {
        toolbar: enabledFormats
      }
    };
    cy.renderWithProps(props);
    cy.getEditorRef().then(reactquill => {
      const quill = reactquill.getEditor();
      expect(quill.options.placeholder).to.equal(props.placeholder);
      expect(quill.options.readOnly).to.equal(props.readOnly);
      expect(quill.options.modules).to.include.keys(Object.keys(props.modules));
      expect(quill.options.formats).to.include.members(props.formats);
    });
  });

  it("prevents using Delta changesets from events as value", () => {
    const value = "<p>Hello, world</p>";
    const changedValue = "Adieu, world!";
    let lastDelta;
    const onChange = (_, delta) => {
      lastDelta = delta;
    };
    cy.renderWithProps({ value, onChange });
    cy.getEditor()
      .type("?")
      .window(w => {
        expect(() => w.setProps({ value: lastDelta })).to.throw(
          "You are passing the `delta` object from the `onChange` event back"
        );
      });
  });
});

describe("old test suite", () => {
  // Instead of running the old test inside JSDOM, run
  // the tests inside the browser environment.
  // This works because we are using Chai and Mocha,
  // just like Cypress.

  const Enzyme = require("enzyme");
  const EnzymeAdapter = require("enzyme-adapter-react-16");
  Enzyme.configure({ adapter: new EnzymeAdapter() });

  require("./index.js");
});
