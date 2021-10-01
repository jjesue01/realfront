import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './services/auth'
import authReducer from '/features/auth/authSlice'
import {collectionsApi} from "./services/collections";
import {listingsApi} from "./services/listings";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, collectionsApi.middleware, listingsApi.middleware),
})

