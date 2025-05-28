import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('Тестирование редьюсера orderSlice', () => {
  describe('Тестирование асинхронного действия getOrderByNumber', () => {
    const mockOrder = ['someOrder'];
    const mockError = { message: 'Mock-error' };

    const actions = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: mockError
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: mockOrder }
      }
    };

    test('Устанавливает request=true при getOrderByNumber.pending', () => {
      const nextState = orderSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(null);
    });

    test('Устанавливает ошибку при getOrderByNumber.rejected', () => {
      const nextState = orderSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(mockError.message);
    });

    test('Сохраняет заказ при getOrderByNumber.fulfilled', () => {
      const nextState = orderSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.orderByNumberResponse).toEqual(mockOrder[0]);
    });
  });
});
