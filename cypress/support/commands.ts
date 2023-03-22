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
    cy.setCookie(
      "next-auth.session-token",
      "06a93a15-a07e-44d1-8507-2e98055435fa"
    );
    cy.setCookie(
      "next-auth.csrf-token",
      "5f80f4555a43c77ded09ba2c05ec3fe61161ab0d7ad38dca029336990c6ef39f%7C1fa29f317a898e0f8f0f3c33c80745fa0aad08496fab101fc5696fe9976a214f"
    );
    cy.setCookie("next-auth.callback-url", "http%3A%2F%2Flocalhost%3A3000");
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}
