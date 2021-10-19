import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    pushNotification: (state, { payload }) => {
      state.push(payload)
    },
    removeNotification: (state) => {
      state.shift()
    }
  },
})

export const { pushNotification, removeNotification } = slice.actions

export default slice.reducer

