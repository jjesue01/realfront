import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {buildFormData, getIdToken} from "../utils";
import {pushToast} from "../features/toasts/toastsSlice";
import {getConfig} from "../app-config";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: getConfig().API_URL,
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
        query: ({ walletId, ...body }) => ({
          url: `/user/${walletId}`,
          method: 'POST',
          body
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled

            if (arg?.invite)
              dispatch(pushToast({ type: 'success', message: 'Invite has been successfully applied' }))
            if (arg?.verify)
              dispatch(pushToast({ type: 'success', message: 'Email has been successfully verified' }))
          } catch (error) {
            let errorMessage = 'Error while signing in'

            if (arg?.invite && error?.error?.data?.message?.includes('Invalid'))
              errorMessage = `Invitation code doesn't exist or expired`

            dispatch(pushToast({ type: 'error', message: errorMessage }))
          }
        }
      }),
      getCurrentUser: builder.query({
        query: () => `/users/me`,
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled
          } catch (error) {
            dispatch(pushToast({ type: 'error', message: 'Error while getting user info' }))
          }
        }
      }),
      updateUser: builder.mutation({
        query: ({ walletAddress, ...data }) => ({
          url: `/users`,
          method: 'PATCH',
          body: data
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled
            dispatch(pushToast({ type: 'success', message: 'Account settings has been successfully updated' }))
          } catch (error) {
            dispatch(pushToast({ type: 'error', message: 'Error while updating account settings' }))
          }
        },
      }),
      updateUserImages: builder.mutation({
        query: (data) => ({
          url: `/users`,
          method: 'PATCH',
          body: buildFormData(data)
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled
            dispatch(pushToast({ type: 'success', message: 'Profile image has been successfully updated' }))
          } catch (error) {
            dispatch(pushToast({ type: 'error', message: 'Error while updating profile image' }))
          }
        }
      }),
      checkRegistration: builder.query({
        query: (walletAddress) => `/users/${walletAddress}/check`,
      }),
  }),
})

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUpdateUserImagesMutation
} = authApi
