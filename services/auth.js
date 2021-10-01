import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken, getUser} from "../utils";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      prepareHeaders: (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = getIdToken()
        if (token) {
          headers.set('authorization', `${token}`)
        }
        return headers
      },
    }),
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (credentials) => ({
          url: `/user/${credentials}`,
          method: 'POST'
        }),
      }),
      getCurrentUser: builder.query({
        query: () => {
          return `/user/${getUser()?._id}`
        },
      }),
      updateUser: builder.mutation({
        query: (data) => ({
          url: `/user`,
          method: 'PATCH',
          body: JSON.stringify(data)
        }),
      }),
  }),
})

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation
} = authApi
