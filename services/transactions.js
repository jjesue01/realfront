import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getConfig().API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getIdToken()
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listing transactions' }))
        }
      }
    }),
    getProfileTransactions: builder.query({
      query: () => '/transactions/me',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting transactions' }))
        }
      }
    }),
    getBids: builder.query({
      query: (params) => ({
        url: '/bids',
        params: {
          limit: 20,
          ...params
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting bids' }))
        }
      }
    }),
    getMyBids: builder.query({
      query: (params = {}) => ({
        url: '/bids/me',
        params: {
          limit: 20,
          ...params
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting bids' }))
        }
      }
    }),
    postBid: builder.mutation({
      query: ({ id, price, bidIndex }) => ({
        url: `/bids`,
        method: 'POST',
        body: {
          listingID: id,
          price,
          bidIndex
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Bid has been successfully placed' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting bids' }))
        }
      }
    }),
    deleteBid: builder.mutation({
      query: ({ id }) => ({
        url: `/bids/${id}`,
        method: 'DELETE'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Bid has been successfully deleted' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while deleting bid' }))
        }
      }
    }),
  }),
})

export const {
  useGetTransactionsByListingIdQuery,
  useGetProfileTransactionsQuery,
  useGetBidsQuery,
  useGetMyBidsQuery,
  usePostBidMutation,
  useDeleteBidMutation,
} = transactionsApi
