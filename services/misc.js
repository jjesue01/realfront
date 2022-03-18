import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const miscApi = createApi({
  reducerPath: 'miscApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getConfig().API_URL,
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
    createOrder: builder.mutation({
      query: (data) => ({
        url: `/orders`,
        method: 'POST',
        body: data
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Your request has been successfully sent' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while creating order' }))
        }
      }
    }),
  }),
})

export const {
  useCreateOrderMutation,
} = miscApi
