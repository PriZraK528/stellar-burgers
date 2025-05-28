/// <reference types="cypress" />
// Добавляет ингредиент в конструктор по ID
Cypress.Commands.add('addIngredient', (id: string) => {
  cy.get(`[data-cy='${id}']`).children('button').click();
});

// Проверяет значение счётчика у ингредиента по ID
Cypress.Commands.add('verifyCounter', (id: string, count: string | number) => {
  cy.get(`[data-cy='${id}']`).find('.counter__num').should('have.text', String(count));
});

// Проверяет, что указанный текст (название ингредиента) присутствует в конструкторе
Cypress.Commands.add('verifyConstructorContains', (text: string) => {
  cy.get('[data-cy="constructor"]').contains(text).should('exist');
});

// Проверяет, что указанный текст (название ингредиента) отсутствует в конструкторе
Cypress.Commands.add('verifyConstructorNotContains', (text: string) => {
  cy.get('[data-cy="constructor"]').contains(text).should('not.exist');
});

// Открывает модальное окно ингредиента по ID и проверяет его по названию
Cypress.Commands.add('openIngredientModal', (id: string, name: string) => {
  cy.get(`[data-cy='${id}']`).children('a').click();
  cy.get('#modals').contains(name).should('exist');
});

// Закрывает модальное окно по крестику
Cypress.Commands.add('closeModal', () => {
  cy.get('#modals').find('button').click();
  cy.get('#modals').should('be.empty');
});

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addIngredient(id: string): Chainable<Element>;
    verifyCounter(id: string, expectedCount: number): Chainable<Element>;
    verifyConstructorContains(text: string): Chainable<Element>;
    verifyConstructorNotContains(text: string): Chainable<Element>;
    openIngredientModal(id: string, text: string): Chainable<Element>;
    closeModal(): Chainable<Element>;
  }
}