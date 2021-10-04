import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";

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
        formData.append("file", data.logo, data.logo.name);
        formData.append("name", data.name);
        formData.append("description", data.description);

        return {
          url: `/collections`,
          method: 'POST',
          body: formData
        }
      },
    }),
    updateCollection: builder.mutation({
      query: (data) => {

        const formData = new FormData();
        formData.append("file", data.logo, data.logo.name);
        formData.append("name", data.name);
        formData.append("description", data.description);

        return {
          url: `/collections/${data._id}`,
          method: 'PATCH',
          body: formData
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
  }),
})

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useGetUserCollectionsQuery,
  useGetCollectionByIdQuery
} = collectionsApi
