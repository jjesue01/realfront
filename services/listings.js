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
        for (const file of data.file)
          formData.append("file", file, file.name);
        for (const rawFile of data.raw) {
          formData.append("raw", rawFile, rawFile.name);
        }
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("city", data.city);
        formData.append("address", data.address);
        formData.append("tags", data.tags);
        formData.append("blockchain", data.blockchain);
        formData.append("longitude", data.longitude);
        formData.append("latitude", data.latitude);
        formData.append("link360", data.link360);
        if (!!data.link360)
          formData.append("thumbnail", data.file[0], data.file[0].name);

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
        if (data?.filesForDelete)
          formData.append('filesForDelete', data.filesForDelete)

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
    depublishListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/depublish`,
        method: 'PATCH',
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
    finishAuction: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/auction`,
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
    getTags: builder.query({
      query: () => `/tags`,
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
  useDepublishListingMutation,
  useLikeListingMutation,
  usePurchaseListingMutation,
  useFinishAuctionMutation,
  useGetListingsQuery,
  useGetPublishedListingsQuery,
  useGetListingByIdQuery,
  useGetTagsQuery
} = listingsApi
