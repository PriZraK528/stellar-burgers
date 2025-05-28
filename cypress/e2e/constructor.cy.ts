/// <reference types="cypress" />

const BASE_URL = 'https://norma.nomoreparties.space/api';

const ID_BUN = '643d69a5c3f7b9001cfa093d'; // Флюоресцентная булка R2-D3
const ID_ANOTHER_BUN = '643d69a5c3f7b9001cfa093c'; // Краторная булка N-200i
const ID_FILLING = '643d69a5c3f7b9001cfa0947'; // Плоды Фалленианского дерева
const ID_SAUCE = '643d69a5c3f7b9001cfa0944'; // Соус традиционный галактический
const ID_MAIN = '643d69a5c3f7b9001cfa0948'; // Кристаллы марсианских альфа-сахаридов

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${BASE_URL}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${BASE_URL}/orders`, { fixture: 'orderResponse.json' });

  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('[data-cy="constructor"]', { timeout: 10000 }).as('constructor');
  cy.get('#modals').as('modal');
});

describe('Работа с ингредиентами в конструкторе', () => {
  it('Счетчик увеличивается при добавлении плодов Фалленианского дерева', () => {
    cy.addIngredient(ID_FILLING);
    cy.verifyCounter(ID_FILLING, 1);
    cy.verifyConstructorContains('Плоды Фалленианского дерева');
  });

  it('Счетчики увеличиваются при добавлении соуса и кристаллов', () => {
    cy.addIngredient(ID_SAUCE);
    cy.addIngredient(ID_MAIN);
    cy.verifyCounter(ID_SAUCE, 1);
    cy.verifyCounter(ID_MAIN, 1);
    cy.verifyConstructorContains('Соус традиционный галактический');
    cy.verifyConstructorContains('Кристаллы марсианских альфа-сахаридов');
  });

  describe('Комбинации добавления ингредиентов', () => {
    it('Флюоресцентная булка и плоды Фалленианского дерева добавляются в заказ', () => {
      cy.addIngredient(ID_BUN);
      cy.addIngredient(ID_FILLING);
      cy.verifyConstructorContains('Флюоресцентная булка R2-D3');
      cy.verifyConstructorContains('Плоды Фалленианского дерева');
    });

    it('Булка добавляется после плодов Фалленианского дерева', () => {
      cy.addIngredient(ID_FILLING);
      cy.addIngredient(ID_BUN);
      cy.verifyConstructorContains('Флюоресцентная булка R2-D3');
      cy.verifyConstructorContains('Плоды Фалленианского дерева');
    });

    it('Полный набор: булка, соус и кристаллы добавляются в заказ', () => {
      cy.addIngredient(ID_BUN);
      cy.addIngredient(ID_SAUCE);
      cy.addIngredient(ID_MAIN);
      cy.verifyConstructorContains('Флюоресцентная булка R2-D3');
      cy.verifyConstructorContains('Соус традиционный галактический');
      cy.verifyConstructorContains('Кристаллы марсианских альфа-сахаридов');
    });
  });

  describe('Манипуляции с булками', () => {
    it('Замена флюоресцентной булки на краторную без начинок', () => {
      cy.addIngredient(ID_BUN);
      cy.addIngredient(ID_ANOTHER_BUN);
      cy.verifyConstructorContains('Краторная булка N-200i');
      cy.verifyConstructorNotContains('Флюоресцентная булка R2-D3');
    });

    it('Замена булки при наличии плодов Фалленианского дерева', () => {
      cy.addIngredient(ID_BUN);
      cy.addIngredient(ID_FILLING);
      cy.addIngredient(ID_ANOTHER_BUN);
      cy.verifyConstructorContains('Краторная булка N-200i');
      cy.verifyConstructorContains('Плоды Фалленианского дерева');
      cy.verifyConstructorNotContains('Флюоресцентная булка R2-D3');
    });

    it('Замена булки при полном наборе ингредиентов', () => {
      cy.addIngredient(ID_BUN);
      cy.addIngredient(ID_SAUCE);
      cy.addIngredient(ID_MAIN);
      cy.addIngredient(ID_ANOTHER_BUN);
      cy.verifyConstructorContains('Краторная булка N-200i');
      cy.verifyConstructorContains('Соус традиционный галактический');
      cy.verifyConstructorContains('Кристаллы марсианских альфа-сахаридов');
      cy.verifyConstructorNotContains('Флюоресцентная булка R2-D3');
    });
  });
});

describe('Процесс оформления заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'ipsum');
    cy.setCookie('accessToken', 'lorem');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });

  it('Успешное оформление заказа с булкой и плодами', () => {
    cy.addIngredient(ID_BUN);
    cy.addIngredient(ID_FILLING);
    cy.get('[data-cy="order-button"]').click();
    cy.get('@modal').find('h2').contains('75000');
    cy.verifyConstructorNotContains('Флюоресцентная булка R2-D3');
    cy.verifyConstructorNotContains('Плоды Фалленианского дерева');
  });

  it('Успешное оформление комплексного заказа', () => {
    cy.addIngredient(ID_BUN);
    cy.addIngredient(ID_SAUCE);
    cy.addIngredient(ID_MAIN);
    cy.get('[data-cy="order-button"]').click();
    cy.get('@modal').find('h2').contains('75000');
    cy.verifyConstructorNotContains('Флюоресцентная булка R2-D3');
    cy.verifyConstructorNotContains('Соус традиционный галактический');
    cy.verifyConstructorNotContains('Кристаллы марсианских альфа-сахаридов');
  });
});

describe('Работа с модальными окнами ингредиентов', () => {
  it('Открытие карточки плодов Фалленианского дерева', () => {
    cy.get('@modal').should('be.empty');
    cy.openIngredientModal(ID_FILLING, 'Плоды Фалленианского дерева');
  });

  it('Открытие карточки галактического соуса', () => {
    cy.get('@modal').should('be.empty');
    cy.openIngredientModal(ID_SAUCE, 'Соус традиционный галактический');
  });

  it('Открытие карточки марсианских кристаллов', () => {
    cy.get('@modal').should('be.empty');
    cy.openIngredientModal(ID_MAIN, 'Кристаллы марсианских альфа-сахаридов');
  });

  it('Закрытие модального окна через крестик', () => {
    cy.openIngredientModal(ID_FILLING, 'Плоды Фалленианского дерева');
    cy.closeModal();
  });

  it('Закрытие модального окна кликом на оверлей', () => {
    cy.get(`[data-cy='${ID_FILLING}']`).children('a').click();
    cy.get('@modal').should('exist');
    cy.get('[data-cy="overlay"]').click({ force: true });
    cy.get('@modal').should('be.empty');
  });
});
