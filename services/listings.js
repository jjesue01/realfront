import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken} from "../utils";
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const listingsApi = createApi({
  reducerPath: 'listingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getConfig().API_URL,
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
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("city", data.city);
        formData.append("address", data.address);
        formData.append("tags", data.tags);
        formData.append("blockchain", data.blockchain);
        formData.append("longitude", data.longitude);
        formData.append("latitude", data.latitude);
        formData.append("link360", data.link360);
        formData.append("resource", data.resource);
        if (!!data.link360)
          formData.append("thumbnail", data.file[0], data.file[0].name);

        return {
          url: `/listings`,
          method: 'POST',
          body: formData
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while creating listing' }))
        }
      }
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Listing has been successfully updated' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while updating listing' }))
        }
      }
    }),
    deleteListing: builder.mutation({
      query: id => ({
        url: `/listings/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Listing has been successfully deleted' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while deleting listing' }))
        }
      }
    }),
    publishListing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/listings/${id}/publish`,
        method: 'PATCH',
        body: data
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while setting on sale' }))
        }
      }
    }),
    depublishListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/depublish`,
        method: 'PATCH',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Listing has been successfully canceled' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while cancelling listing' }))
        }
      }
    }),
    likeListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/like`,
        method: 'PATCH'
      })
    }),
    purchaseListing: builder.mutation({
      query: (listing) => ({
        url: `/listings/${listing._id}/purchase`,
        method: 'POST',
        body: {
          tokenId: listing.tokenIds[0]
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while buying NFT' }))
        }
      }
    }),
    finishAuction: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}/auction`,
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while finishing auction' }))
        }
      }
    }),
    getListings: builder.query({
      query: (params = {}) => ({
        url: '/listings',
        params: {
          limit: 1000,
          ...params
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listings' }))
        }
      }
    }),
    getPublishedListings: builder.query({
      query: (params = {}) => ({
        url: '/explore',
        params: {
          limit: 1000,
          ...params
        }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listings' }))
        }
      }
    }),
    getTags: builder.query({
      query: () => `/tags`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting tags' }))
        }
      }
    }),
    getListingById: builder.query({
      query: id => `/listings/${id}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listing' }))
        }
      }
    }),
    getLeaderBoard: builder.query({
      query: (params) => `/leaderboard`,
      async onQueryStarted(arg, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled
        } catch (error){
          dispatch(pushToast({type: 'error', message: 'Error while getting leaderboard'}))
        }
      }
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
  useGetTagsQuery,
  useGetLeaderBoardQuery
} = listingsApi
