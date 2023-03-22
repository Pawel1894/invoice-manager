/// <reference types="cypress" />
export {};

Cypress.Commands.add("login", () => {
  const data = {
    user: {
      name: "Paweł P",
      email: "pawepohl@gmail.com",
      image: null,
    },
    expires: "3000-01-01T00:00:00.000Z",
    accessToken: "abcdefghijklmnopqrst",
  };

  cy.session(data, () => {
    cy.setCookie("next-auth.session-token", "valid cookie");
    cy.setCookie("next-auth.csrf-token", "valid cookie");
    cy.setCookie("next-auth.callback-url", "valid cookie");
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}
