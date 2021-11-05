import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";

export const citiesApi = createApi({
  reducerPath: 'citiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
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
    }),
  }),
})

export const {
  useGetAutocompleteCitiesQuery,
  useGetCitiesQuery
} = citiesApi
