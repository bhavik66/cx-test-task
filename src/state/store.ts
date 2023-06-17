import { AnyAction, combineReducers, Reducer } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import * as reducers from './ducks';

const persistConfig = {
  key: 'root',
  storage,
};

const combinedReducer = combineReducers(reducers);

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    state = {} as RootState;
  }

  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* Reference: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data */

const asyncCountMap = new Map<string, number>();

const _store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      ...(process.env.NODE_ENV !== 'production'
        ? [createLogger({ collapsed: true })]
        : []),
    ]),
});

const store = Object.assign(_store, { asyncCountMap });
const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
