import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './services/auth'
import authReducer from '/features/auth/authSlice'
import notificationsReducer from '/features/notifications/notificationsSlice'
import {citiesApi} from "./services/cities";
import {listingsApi} from "./services/listings";
import {transactionsApi} from "./services/transactions";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [citiesApi.reducerPath]: citiesApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    auth: authReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      citiesApi.middleware,
      listingsApi.middleware,
      transactionsApi.middleware,
    ),
})

