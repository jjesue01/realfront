import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    setCredentials: (state, { payload: {  } }) => {

    }
  },
})

export const { pushNotification } = slice.actions

export default slice.reducer

