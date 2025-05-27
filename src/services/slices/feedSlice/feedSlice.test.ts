import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('Тестирование редьюсера feedSlice', () => {
  describe('Асинхронное действие getFeeds', () => {
    describe('Состояние pending', () => {
      const action = {
        type: getFeeds.pending.type,
        payload: null
      };

      test('устанавливает флаг загрузки и очищает ошибки', () => {
        const newState = feedSlice(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(null);
        expect(newState.orders).toEqual([]);
      });
    });

    describe('Состояние rejected', () => {
      const errorMessage = 'Ошибка загрузки данных';
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };

      test('устанавливает ошибку и завершает загрузку', () => {
        const newState = feedSlice(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(errorMessage);
        expect(newState.orders).toEqual([]);
      });
    });

    describe('Состояние fulfilled', () => {
      const payload = {
        orders: [
          { id: 1, status: 'created' },
          { id: 2, status: 'pending' }
        ],
        total: 100,
        totalToday: 10
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload
      };

      test('сохраняет заказы и статистику, завершает загрузку', () => {
        const newState = feedSlice(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(null);
        expect(newState.orders).toHaveLength(2);
        expect(newState.orders).toEqual(expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 })
        ]));
        expect(newState.total).toBe(100);
        expect(newState.totalToday).toBe(10);
      });
    });
  });
});
