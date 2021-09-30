import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, { payload: { user, token } }) => {
      state.user = user
      state.token = token
      localStorage.setItem('auth', JSON.stringify({ user, token }))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('auth')
    }
  },
})

export const { setCredentials, logout } = slice.actions

export default slice.reducer

