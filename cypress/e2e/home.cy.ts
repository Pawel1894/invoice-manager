describe("The Home Page", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it("successfully loads", () => {
    cy.visit("/");
  });
  it("should display sign in heading", () => {
    cy.visit("/");
    cy.get("body").should("contain", "Sign in to Invoices Manager");
  });
  it("should contain email input", () => {
    cy.visit("/");
    cy.get("body").find("input[data-testid='email-input']");
  });
  it("should allow to log in via email and redirect to check email page", () => {
    const email = Cypress.env("TEST_EMAIL") as string;
    cy.visit("/");
    cy.get("body").find("input[data-testid='email-input']").type(email);
    cy.get("button[data-testid='email-btn'").click();
    cy.url().should(
      "include",
      "/api/auth/verify-request?provider=email&type=email"
    );
    cy.get("body").contains(
      "A sign in link has been sent to your email address."
    );
  });
  it("redirect to google signin page", () => {
    // full login process does not work due to security policy
    Cypress.on(
      "uncaught:exception",
      (err) =>
        !err.message.includes("ResizeObserver loop") &&
        !err.message.includes("Error in protected function")
    );
    cy.visit("/");
    cy.get("#google-login").click();

    cy.origin("https://accounts.google.com", () => {
      Cypress.on(
        "uncaught:exception",
        (err) =>
          !err.message.includes("ResizeObserver loop") &&
          !err.message.includes("Error in protected function")
      );

      cy.get('input[type="email"]').should("exist");
    });
  });
});
