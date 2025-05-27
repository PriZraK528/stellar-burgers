import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('Редьюсер constructorSlice', () => {
  describe('Добавление ингредиентов', () => {
    const baseState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('Добавляет sauce в список ингредиентов', () => {
      const sauce = {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
      };

      const newState = constructorSlice(baseState, addIngredient(sauce));
      const added = newState.constructorItems.ingredients[0];

      expect(added).toEqual({
        ...sauce,
        id: expect.any(String)
      });
    });

    test('Добавляет булку в пустой конструктор', () => {
      const bun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      const newState = constructorSlice(baseState, addIngredient(bun));
      expect(newState.constructorItems.bun).toEqual({
        ...bun,
        id: expect.any(String)
      });
    });

    test('Заменяет текущую булку новой', () => {
      const initialBun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        id: 'initial-bun-id',
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      const newBun = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };

      const stateWithBun = {
        ...baseState,
        constructorItems: {
          bun: initialBun,
          ingredients: []
        }
      };

      const newState = constructorSlice(stateWithBun, addIngredient(newBun));
      const updatedBun = newState.constructorItems.bun;

      expect(updatedBun).toEqual({
        ...newBun,
        id: expect.any(String)
      });

      expect(updatedBun?.id).not.toBe(initialBun.id);
    });
  });

  describe('Удаление ингредиентов', () => {
    const ingredient = {
      id: 'ingredient-to-remove',
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    };

    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient]
      }
    };

    test('Удаляет ингредиент по ID', () => {
      const newState = constructorSlice(stateWithIngredient, removeIngredient(ingredient.id));
      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Перемещение ингредиентов', () => {
    const ingredients = [
      {
        id: 'first-ingredient',
        _id: '643d69a5c3f7b9001cfa0944',
        name: 'Соус традиционный галактический',
        type: 'sauce',
        proteins: 42,
        fat: 24,
        carbohydrates: 42,
        calories: 99,
        price: 15,
        image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
      },
      {
        id: 'second-ingredient',
        _id: '643d69a5c3f7b9001cfa0946',
        name: 'Хрустящие минеральные кольца',
        type: 'main',
        proteins: 808,
        fat: 689,
        carbohydrates: 609,
        calories: 986,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
      },
      {
        id: 'third-ingredient',
        _id: '643d69a5c3f7b9001cfa0947',
        name: 'Плоды Фалленианского дерева',
        type: 'main',
        proteins: 20,
        fat: 5,
        carbohydrates: 55,
        calories: 77,
        price: 874,
        image: 'https://code.s3.yandex.net/react/code/sp_1.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
      }
    ];


    const state = {
      ...initialState,
      constructorItems: {
        bun: {
          id: 'bun-id',
          _id: '0',
          name: 'Булка',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 150,
          price: 10,
          image: '',
          image_mobile: '',
          image_large: ''
        },
        ingredients: [...ingredients]
      }
    };

    test('Перемещает ингредиент вверх', () => {
      const newState = constructorSlice(state, moveIngredientUp(2));
      expect(newState.constructorItems.ingredients[1].id).toBe('third-ingredient');
      expect(newState.constructorItems.ingredients[2].id).toBe('second-ingredient');
    });

    test('Перемещает ингредиент вниз', () => {
      const newState = constructorSlice(state, moveIngredientDown(1));
      expect(newState.constructorItems.ingredients[1].id).toBe('third-ingredient');
      expect(newState.constructorItems.ingredients[2].id).toBe('second-ingredient');
    });
  });

  describe('Создание заказа', () => {
    const actions = {
      pending: { type: orderBurger.pending.type },
      rejected: { type: orderBurger.rejected.type, error: { message: 'Ошибка теста' } },
      fulfilled: { type: orderBurger.fulfilled.type, payload: { order: { number: 12345 } } }
    };

    test('Устанавливает загрузку при отправке заказа', () => {
      const state = constructorSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает ошибку при создании заказа', () => {
      const state = constructorSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка теста');
      expect(state.orderModalData).toBeNull();
    });

    test('Успешно завершает создание заказа', () => {
      const state = constructorSlice(initialState, actions.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderModalData?.number).toBe(12345);
    });
  });
});
