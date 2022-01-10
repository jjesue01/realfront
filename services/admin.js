import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {pushToast} from "../features/toasts/toastsSlice";

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
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
          dispatch(pushToast({ type: 'error', message: 'Error while getting invites list' }))
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
  }),
})

export const {
  useAdminLoginMutation,
  useGetInvitesQuery,
  useSendInviteMutation
} = adminApi
