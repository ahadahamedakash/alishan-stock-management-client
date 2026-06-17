import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  //
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { baseApi } from './api/base-api';

import authReducer from './features/auth/authSlice';

// ----------------------------------------------------------------------

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
