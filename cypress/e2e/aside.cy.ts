describe("Layout functionality", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/invoice");
  });
  it("theme color btn should exist", () => {
    cy.get("[data-testid='theme-toggle']").should("exist");
  });
  it("should change theme color", () => {
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.hasClass("dark")) {
        cy.get("[data-testid='theme-toggle']").click();
        cy.get("body.dark").should("not.exist");
      } else {
        cy.get("[data-testid='theme-toggle']").click();
        cy.get("body.dark").should("exist");
      }
    });
  });
  it("should open user popup", () => {
    cy.get("[data-testid='userProfile'").click();
    cy.get("[data-testid='userPopup'").should("be.visible");
  });
  it("user popup should contain sign out button", () => {
    cy.get("[data-testid='userProfile'").click();
    cy.get("[data-testid='userPopup'").should("be.visible");
    cy.get("[data-testid='userPopup'").contains("Sign out");
  });
  it("should open and close user popup", () => {
    cy.get("[data-testid='userProfile'").click();
    cy.get("[data-testid='userPopup'").should("be.visible");

    cy.get("body").click();
    cy.get("[data-testid='userPopup'").should("not.exist");
  });
});

export {};
