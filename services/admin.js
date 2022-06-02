import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getConfig().API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.admin?.token
      if (token) headers.set('authorization', `${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: `/admin/login`,
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          console.log('error')
          dispatch(pushToast({ type: 'error', message: 'Incorrect email or password' }))
        }
      }
    }),
    getInvites: builder.query({
      query: (params = {}) => ({
        url: '/admin/invitations',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting users list' }))
        }
      }
    }),
    sendInvite: builder.mutation({
      query: (email) => ({
        url: `/admin/invitations`,
        method: 'POST',
        body: { email }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'Invitation has been successfully sent' }))
        } catch (error) {
          console.log('error')
          dispatch(pushToast({ type: 'error', message: 'Error while sending invitation' }))
        }
      }
    }),
    getAllUsers: builder.query({
      query: (params = {}) => ({
        url: '/admin/users',
        params
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting users' }))
        }
      }
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting user' }))
        }
      }
    }),
    getListings: builder.query({
      query: (params) => ({
        url: `/admin/listings`,
        params
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listings' }))
        }
      }
    }),
    updateUser: builder.mutation({
      query: ({ _id, ...user }) => ({
        url: `/admin/users/${_id}`,
        method: 'PATCH',
        body: user
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(pushToast({ type: 'success', message: 'User has been successfully updated' }))
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while updating user' }))
        }
      }
    }),
    // downloadPhoto: builder.query({
    //   query: ({_id}) => ({
    //     url: `admin/listings/${_id}/download`,
    //   }),
    //   async onQueryStarted(arg, {dispatch, queryFulfilled}){
    //     try {
    //       queryFulfilled.then(res => console.log(res.blob()));
    //     } catch(error){
    //       dispatch(pushToast({ type: 'error', message: 'Error download file' }))
    //     }
    //   }
    // })
    getTransactions: builder.query({
      query: (params) => ({
        url: `/admin/transactions`,
        params
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          dispatch(pushToast({ type: 'error', message: 'Error while getting listings' }))
        }
      }
    }),
  }),
})

export const {
  useAdminLoginMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useGetListingsQuery,
  useGetInvitesQuery,
  useGetAllUsersQuery,
  useSendInviteMutation,
  useGetTransactionsQuery,
} = adminApi
