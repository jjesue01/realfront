import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getIdToken()
     //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRVc2VyIjp7Im5vdGlmaWNhdGlvbnMiOnsiYXVjdGlvbkV4cGlyYXRpb24iOmZhbHNlLCJiaWRBY3Rpdml0eSI6ZmFsc2UsIml0ZW1Tb2xkIjpmYWxzZSwibmV3c0xldHRlciI6ZmFsc2UsIm91dGJpZCI6ZmFsc2UsIm93bmVkVXBkYXRlIjpmYWxzZSwicHJpY2VDaGFuZ2UiOmZhbHNlLCJyZWZlcnJhbFN1Y2Nlc3NmdWwiOmZhbHNlLCJzdWNjZXNzZnVsUHVyY2hhc2UiOmZhbHNlfSwiZmF2b3JpdGVzIjpbXSwiX2lkIjoiNjE1YWQzNGYzMmIyNGJhMjAwOTkwZWEzIiwid2FsbGV0QWRkcmVzcyI6IjB4NGU4NGY2Y0Q5RDQ4ODlCRUM5QUM4Nzg4QjE4NTA2NTZiNDUzRjlmMSIsImNyZWF0ZWRBdCI6IjIwMjEtMTAtMDRUMTA6MTE6MjcuODgyWiIsIl9fdiI6MCwibGFzdExvZ2luQXQiOiIyMDIxLTEwLTA4VDEyOjQ0OjE5Ljc4N1oiLCJiaW8iOiJCYWNrZW5kIiwiZW1haWwiOiJmd2FoeXVkaTFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJmd2FoeXVkaTEifSwiaWF0IjoxNjMzNzgzMTQxLCJleHAiOjE2MzM4Njk1NDF9.PcoTVXCzi4b7DP9lc1KZh5N5b4DM4DZpl0LFC-wy6SA'
      if (token) {
        headers.set('authorization', token)
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
    getProfileTransactions: builder.query({
      query: () => '/transactions/me'
    }),
    getBids: builder.query({
      query: (listingId) => ({
        url: '/bids',
        params: {
          limit: 20,
          listingID: listingId
        }
      })
    }),
    postBid: builder.mutation({
      query: ({ id, price }) => ({
        url: `/bids`,
        method: 'POST',
        body: {
          listingID: id,
          price
        }
      })
    }),
    deleteBid: builder.mutation({
      query: ({ id }) => ({
        url: `/bids/${id}`,
        method: 'DELETE'
      })
    }),
  }),
})

export const {
  useGetTransactionsByListingIdQuery,
  useGetProfileTransactionsQuery,
  useGetBidsQuery,
  usePostBidMutation,
  useDeleteBidMutation,
} = transactionsApi
