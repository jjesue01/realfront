import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken} from "../utils";

export const listingsApi = createApi({
  reducerPath: 'listingsApi',
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
    createListing: builder.mutation({
      query: (data) => {
        let formData = new FormData()
        console.log('send listing', data)
        formData.append("file", data.file, data.file.name);
        formData.append("raw", data.raw, data.raw.name);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("city", data.city);
        formData.append("address", data.address);
        formData.append("tags", data.tags);
        formData.append("blockchain", data.blockchain);
        formData.append("longitude", data.longitude);
        formData.append("latitude", data.latitude);

        return {
          url: `/listings`,
          method: 'POST',
          body: formData
        }
      },
    }),
    updateListing: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = buildFormData(data)

        return {
          url: `/listings/${id}`,
          method: 'PATCH',
          body: formData
        }
      },
    }),
    deleteListing: builder.mutation({
      query: id => ({
        url: `/listings/${id}`,
        method: 'DELETE',
      })
    }),
    publishListing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/listings/${id}/publish`,
        method: 'PATCH',
        body: data
      })
    }),
    likeListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/like`,
        method: 'PATCH'
      })
    }),
    purchaseListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/purchase`,
        method: 'POST'
      })
    }),
    getListings: builder.query({
      query: (params = {}) => ({
        url: '/listings',
        params: {
          limit: 1000,
          ...params
        }
      }),
      // transformResponse(baseQueryReturnValue, meta) {
      //   return baseQueryReturnValue.docs
      // }
    }),
    getPublishedListings: builder.query({
      query: (params = {}) => ({
        url: '/explore',
        params: {
          limit: 1000,
          ...params
        }
      }),
    }),
    getListingById: builder.query({
      query: id => `/listings/${id}`,
    })
  }),
})

export const {
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  usePublishListingMutation,
  useLikeListingMutation,
  usePurchaseListingMutation,
  useGetListingsQuery,
  useGetPublishedListingsQuery,
  useGetListingByIdQuery
} = listingsApi
