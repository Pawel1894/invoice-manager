describe("The invoice insert form", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/invoice");
  });
  it("should open insert form", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("[data-testid='insert-form']")
      .parent()
      .scrollIntoView()
      .should("be.visible");
  });

  it("should render insert form", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("[data-testid='insert-form']")
      .parent()
      .scrollIntoView()
      .should("not.be.visible");
  });

  it("should show error for name field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#name").focus().type("test").clear().blur();
    cy.get("[data-testid='error-name']").should("exist");
  });

  it("should show error for streetAddress field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#fromStreetAddress").focus().type("test").clear().blur();
    cy.get("[data-testid='error-fromStreetAddress']").should("exist");
  });

  it("should show error for city field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#city").focus().type("test").clear().blur();
    cy.get("[data-testid='error-city']").should("exist");
  });

  it("should show error for postcode field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#fromPostCode").focus().type("test").clear().blur();
    cy.get("[data-testid='error-fromPostCode']").should("exist");
  });

  it("should show error for country field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#fromCountry").focus().type("test").clear().blur();
    cy.get("[data-testid='error-fromCountry']").should("exist");
  });

  it("should show error for client name field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#clientName").focus().type("test").clear().blur();
    cy.get("[data-testid='error-clientName']").should("exist");
  });

  it("should show error for client street address field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#clientStreetAddress").focus().type("test").clear().blur();
    cy.get("[data-testid='error-clientStreetAddress']").should("exist");
  });

  it("should show error for client country field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#clientCountry").focus().type("test").clear().blur();
    cy.get("[data-testid='error-clientCountry']").should("exist");
  });

  it("should show error for client city field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#clientCity").focus().type("test").clear().blur();
    cy.get("[data-testid='error-clientCity']").should("exist");
  });

  it("should show error for client postcode field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#clientPostCode").focus().type("test").clear().blur();
    cy.get("[data-testid='error-clientPostCode']").should("exist");
  });

  it("should show error for invoice number field", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#invoiceNum").focus().type("test").clear().blur();
    cy.get("[data-testid='error-invoiceNum']").should("exist");
  });

  it("should create invoice and open email form", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("#name").focus().clear().type("test");
    cy.get("#fromStreetAddress").focus().clear().type("test");
    cy.get("#city").focus().clear().type("test");
    cy.get("#fromPostCode").focus().clear().type("test");
    cy.get("#fromCountry").focus().clear().type("test");
    cy.get("#clientName").focus().clear().type("test");
    cy.get("#clientStreetAddress").focus().clear().type("test");
    cy.get("#clientCountry").focus().clear().type("test");
    cy.get("#clientCity").focus().clear().type("test");
    cy.get("#clientEmail").focus().clear().type("test@test.te");
    cy.get("#clientPostCode").focus().clear().type("test");
    cy.get("#invoiceNum").focus().clear().type("test");
    cy.get("#idNo").focus().clear().type("test");
    cy.get("#bankAccount").focus().clear().type("test");
    cy.get("#clientId").focus().clear().type("test");
    cy.get("#projectDescription").focus().clear().type("test");
    cy.get("[name='items[0].name']").clear().type("test");
    cy.contains("Save & Continue").click();
    cy.wait(1000);
    cy.contains("Send test").should("exist");
  });
});

describe("The invoice items", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/invoice");
  });
  it("should add new item", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("[data-testid='insert-new-item']").click();
    cy.get("[data-testid='insert-items-container']")
      .children()
      .should("have.length", 3);
  });

  it("should be able to type item name", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("[name='items[0].name']").focus().type("testing item input");
    cy.get("[name='items[0].name']").should("have.value", "testing item input");
  });

  it("should calculate net value", () => {
    cy.get("[data-testid='new-invoice']").click();
    cy.get("[name='items.0.price']").focus().clear().type("40");
    cy.get("[data-testid='items.0.net']").should("have.text", "$40.00");

    cy.get("[name='items.0.quantity']").focus().clear().type("2");

    cy.get("[data-testid='items.0.net']").should("have.text", "$80.00");
  });

  it("should calculate gross value", () => {
    cy.get("[data-testid='new-invoice']").click();

    cy.get("[name='items.0.price']").focus().clear().type("10");
    cy.get("[data-testid='items.0.gross']").should("have.text", "$10.00");

    cy.get("[name='items.0.quantity']").focus().clear().type("2");
    cy.get("[data-testid='items.0.gross']").should("have.text", "$20.00");

    cy.get("[name='items.0.tax']").focus().clear().type("10");
    cy.get("[data-testid='items.0.gross']").should("have.text", "$22.00");

    cy.get("[name='items.0.tax']").focus().clear().type("50");
    cy.get("[data-testid='items.0.gross']").should("have.text", "$30.00");
  });
});

export {};
