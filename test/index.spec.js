beforeEach(() => {
  cy.visit("/");
});

it("can type in editor", function() {
  cy.get(".ql-editor")
    .type("hello world\n\nfoo bar")
    .should("contain", "hello world")
    .should("contain", "foo bar");
});

it("cannot type in read-only editor", function() {
  cy.get("button")
    .contains("Set read-only")
    .click();

  cy.get(".ql-editor").should("have.attr", "contenteditable", "false");
});

it("does not render container if disabled", function() {
  cy.get("button")
    .contains("Disable")
    .click();

  cy.get(".ql-editor").should("not.exist");
});

it("preserves content when switching to read-only mode", function() {
  cy.get(".ql-editor").as("editor");

  cy.get("@editor")
    .type("some text")
    .should("contain", "some text");

  cy.get("button")
    .contains("Set read-only")
    .click();

  cy.get("@editor").should("contain", "some text");
});
