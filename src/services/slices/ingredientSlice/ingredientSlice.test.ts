import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('Тестирование редьюсера ingredientSlice', () => {
  const mockIngredients = [
    {
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
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  describe('Асинхронное действие getIngredients', () => {
    describe('Pending-состояние', () => {
      const action = { type: getIngredients.pending.type, payload: null };

      test('устанавливает флаг loading в true и очищает ошибку', () => {
        const state = ingredientSlice(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.ingredients).toEqual([]);
      });
    });

    describe('Rejected-состояние', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };

      test('устанавливает ошибку и завершает загрузку', () => {
        const state = ingredientSlice(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.ingredients).toEqual([]);
      });
    });

    describe('Fulfilled-состояние', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };

      test('сохраняет ингредиенты и завершает загрузку', () => {
        const state = ingredientSlice(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(null);
        expect(state.ingredients).toHaveLength(mockIngredients.length);
        expect(state.ingredients).toEqual(expect.arrayContaining([
          expect.objectContaining({ type: 'bun' }),
          expect.objectContaining({ type: 'main' })
        ]));

        // Дополнительные проверки структуры ингредиента
        const firstIngredient = state.ingredients[0];
        expect(firstIngredient).toHaveProperty('_id');
        expect(firstIngredient).toHaveProperty('name');
        expect(firstIngredient).toHaveProperty('image');
      });
    });
  });
});
