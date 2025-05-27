import Cypress from 'cypress';

const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`; // Флюоресцентная булка R2-D3
const ID_ANOTHER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`; // Краторная булка N-200i
const ID_FILLING = `[data-cy=${'643d69a5c3f7b9001cfa0947'}]`; // Плоды Фалленианского дерева
const ID_SAUCE = `[data-cy=${'643d69a5c3f7b9001cfa0944'}]`; // Соус традиционный галактический
const ID_MAIN = `[data-cy=${'643d69a5c3f7b9001cfa0948'}]`; // Кристаллы марсианских альфа-сахаридов

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get(`[data-cy='constructor']`, { timeout: 10000 }).as('constructor');
  cy.get('#modals').as('modal');
});

describe('Работа с ингредиентами в конструкторе', () => {
  it('Счетчик увеличивается при добавлении плодов Фалленианского дерева', () => {
    cy.get(ID_FILLING).children('button').click();
    cy.get(ID_FILLING).find('.counter__num').contains('1');
    cy.get('@constructor').contains('Плоды Фалленианского дерева').should('exist');
  });

  it('Счетчики увеличиваются при добавлении соуса и кристаллов', () => {
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(ID_SAUCE).find('.counter__num').contains('1');
    cy.get(ID_MAIN).find('.counter__num').contains('1');
    cy.get('@constructor').within(() => {
      cy.contains('Соус традиционный галактический').should('exist');
      cy.contains('Кристаллы марсианских альфа-сахаридов').should('exist');
    });
  });

  describe('Комбинации добавления ингредиентов', () => {
    it('Флюоресцентная булка и плоды Фалленианского дерева добавляются в заказ', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Плоды Фалленианского дерева').should('exist');
      });
    });

    it('Булка добавляется после плодов Фалленианского дерева', () => {
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Плоды Фалленианского дерева').should('exist');
      });
    });

    it('Полный набор: булка, соус и кристаллы добавляются в заказ', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Соус традиционный галактический').should('exist');
        cy.contains('Кристаллы марсианских альфа-сахаридов').should('exist');
      });
    });
  });

  describe('Манипуляции с булками', () => {
    it('Замена флюоресцентной булки на краторную без начинок', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
      });
    });

    it('Замена булки при наличии плодов Фалленианского дерева', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
        cy.contains('Плоды Фалленианского дерева').should('exist');
      });
    });

    it('Замена булки при полном наборе ингредиентов', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
        cy.contains('Соус традиционный галактический').should('exist');
        cy.contains('Кристаллы марсианских альфа-сахаридов').should('exist');
      });
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
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_FILLING).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('75000');
    cy.get('@constructor').within(() => {
      cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
      cy.contains('Плоды Фалленианского дерева').should('not.exist');
    });
  });

  it('Успешное оформление комплексного заказа', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('75000');
    cy.get('@constructor').within(() => {
      cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
      cy.contains('Соус традиционный галактический').should('not.exist');
      cy.contains('Кристаллы марсианских альфа-сахаридов').should('not.exist');
    });
  });
});

describe('Работа с модальными окнами ингредиентов', () => {
  it('Открытие карточки плодов Фалленианского дерева', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Плоды Фалленианского дерева').should('exist');
  });

  it('Открытие карточки галактического соуса', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_SAUCE).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Соус традиционный галактический').should('exist');
  });

  it('Открытие карточки марсианских кристаллов', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_MAIN).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Кристаллы марсианских альфа-сахаридов').should('exist');
  });

  it('Закрытие модального окна через крестик', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });

  it('Закрытие модального окна кликом на оверлей', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('exist');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });
});