import store, { rootReducer } from '../services/store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при неизвестном действии', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const resultState = rootReducer(undefined, unknownAction);
    const expectedState = store.getState();

    expect(resultState).toEqual(expectedState);
  });
});
