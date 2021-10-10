import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken, getUser} from "../utils";

export const authApi = createApi({
    reducerPath: 'authApi',
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
      login: builder.mutation({
        query: (credentials) => ({
          url: `/user/${credentials}`,
          method: 'POST'
        }),
      }),
      getCurrentUser: builder.query({
        query: () => `/users/me`,
      }),
      updateUser: builder.mutation({
        query: ({ walletAddress, ...data }) => ({
          url: `/users`,
          method: 'PATCH',
          body: data
        }),
      }),
      updateUserImages: builder.mutation({
        query: (data) => ({
          url: `/users`,
          method: 'PATCH',
          body: buildFormData(data)
        }),
      }),
  }),
})

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUpdateUserImagesMutation
} = authApi
