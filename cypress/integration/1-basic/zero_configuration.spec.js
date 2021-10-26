/// <reference types="cypress" />

describe("Dropzone with zero configuration", () => {
  beforeEach(() => {
    cy.visit("/1-basic/zero_configuration.html");
  });

  it("uploads single file", () => {
    cy.intercept("POST", "/").as("upload");

    cy.get(".dropzone").attachFile("image.jpg", {
      subjectType: "drag-n-drop",
    });

    cy.wait("@upload").then((interception) => {
      expect(JSON.parse(interception.response.body)).to.deep.eq({
        success: true,
      });
    });
  });
});
