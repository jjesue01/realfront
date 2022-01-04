import { createSlice } from '@reduxjs/toolkit'
import {listingsApi} from "../../services/listings";

const slice = createSlice({
  name: 'toasts',
  initialState: [],
  reducers: {
    pushToast: (state, { payload: { type, message } }) => {
      state.push({ type, message })
    },
    removeToast: (state) => {
      state.shift()
    }
  },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     listingsApi.endpoints.getPublishedListings.matchRejected,
  //     (state, { payload }) => {
  //       state.push({ type: 'error', message: 'Error while getting listings' })
  //     }
  //   )
  //   builder.addMatcher(
  //     listingsApi.endpoints.getListings.matchRejected,
  //     (state, { payload }) => {
  //       state.push({ type: 'error', message: 'Error while getting listings' })
  //     }
  //   )
  // },
})

export const { pushToast, removeToast } = slice.actions

export default slice.reducer

