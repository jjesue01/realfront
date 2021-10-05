import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getIdToken} from "../utils";

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

        formData.append("file", data.file, data.file.name);
        formData.append("raw", data.raw, data.raw.name);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("location", data.location);
        formData.append("address", data.address);
        formData.append("collections", data.collections);
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
    getListings: builder.query({
      query: () => '/listings',
      // transformResponse(baseQueryReturnValue, meta) {
      //   return baseQueryReturnValue.docs
      // }
    }),
    getListingById: builder.query({
      query: id => `/listings/${id}`
    })
  }),
})

export const {
  useCreateListingMutation,
  useGetListingsQuery,
  useGetListingByIdQuery
} = listingsApi
