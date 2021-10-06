import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getIdToken()
      if (token) {
        headers.set('authorization', `${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getTransactionsByListingId: builder.query({
      query: (listingId) => {
        return ({
          url: '/transactions',
          params: {
            listingID: listingId
          }
        })
      },
    }),
  }),
})

export const {
  useGetTransactionsByListingIdQuery,
} = transactionsApi
