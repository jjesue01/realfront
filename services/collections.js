import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const collectionsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    createCollection: builder.mutation({
      query: (formData) => ({
        url: `/collection`,
        method: 'POST',
        body: formData
      }),
    }),
    getUserCollections: builder.query({
      query: '/collections',
    }),
  }),
})

export const {
  useCreateCollectionMutation,
  useGetUserCollectionsQuery
} = collectionsApi
