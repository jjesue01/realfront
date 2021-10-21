import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken} from "../utils";

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
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
    createCollection: builder.mutation({
      query: (data) => {

        const formData = new FormData();
        formData.append("logoImage", data.logo, data.logo.name);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("city", data.city);

        return {
          url: `/collections`,
          method: 'POST',
          body: formData
        }
      },
    }),
    updateCollection: builder.mutation({
      query: ({ id, ...data }) => {

        const formData = buildFormData(data)

        return {
          url: `/collections/${id}`,
          method: 'PATCH',
          body: formData
        }
      },
    }),
    deleteCollection: builder.mutation({
      query: (id) => {
        return {
          url: `/collections/${id}`,
          method: 'DELETE'
        }
      },
    }),
    getUserCollections: builder.query({
      query: () => '/collections',
      transformResponse(baseQueryReturnValue, meta) {
        return baseQueryReturnValue.docs
      }
    }),
    getCollectionById: builder.query({
      query: (id) => `/collections/${id}`,
    }),
    getAutocompleteCollections: builder.query({
      query: (params = {}) => ({
        url: '/autocomplete/collections',
        params: {
          limit: 20,
          ...params
        }
      }),
    }),
  }),
})

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetUserCollectionsQuery,
  useGetCollectionByIdQuery,
  useGetAutocompleteCollectionsQuery
} = collectionsApi
