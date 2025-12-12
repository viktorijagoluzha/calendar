/**
 * @format
 */

import { store } from '../src/store';

describe('App', () => {
  it('should have a configured Redux store', () => {
    expect(store).toBeDefined();
    expect(store.getState()).toBeDefined();
    expect(store.getState().auth).toBeDefined();
    expect(store.getState().events).toBeDefined();
  });

  it('should have initial auth state', () => {
    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
    expect(authState.isLoading).toBe(false);
  });

  it('should have initial events state', () => {
    const eventsState = store.getState().events;
    expect(eventsState.events).toEqual([]);
    expect(eventsState.isLoading).toBe(false);
  });
});
