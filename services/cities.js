import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken} from "../utils";
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const citiesApi = createApi({
  reducerPath: 'citiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getConfig().API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getIdToken()
      if (token) {
        headers.set('Authorization', `${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getCities: builder.query({
      query: (params) => ({
        url: '/cities',
        params: {
          limit: 50,
          ...params
        }
      }),
      transformResponse(baseQueryReturnValue, meta) {
        return baseQueryReturnValue.docs
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting cities' }))
        }
      }
    }),
    createCity: builder.mutation({
      query: (data) => {
        return {
          url: `/cities`,
          method: 'POST',
          body: data
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while adding new city' }))
        }
      }
    }),
    getAutocompleteCities: builder.query({
      query: (params = {}) => ({
        url: '/autocomplete/cities',
        params: {
          limit: 20,
          ...params
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting cities' }))
        }
      }
    }),
  }),
})

export const {
  useGetAutocompleteCitiesQuery,
  useGetCitiesQuery,
  useCreateCityMutation
} = citiesApi
