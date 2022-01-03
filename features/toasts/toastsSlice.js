import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'toasts',
  initialState: [],
  reducers: {
    pushToast: (state, { payload: { type, message } }) => {
      state.push({ id: Date.now(), type, message })
    },
    removeToast: (state) => {
      state.shift()
    }
  },
})

export const { pushToast, removeToast } = slice.actions

export default slice.reducer

