import { createSlice } from '@reduxjs/toolkit'
import {authApi} from "../../services/auth";

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    admin: {
      hasAccess: false
    }
  },
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
    },
    setAdmin: (state, { payload }) => {
      state.admin = { ...state.admin, ...payload }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload
        localStorage.setItem('auth', JSON.stringify({ user: payload, token: state.token }))
      }
    )
  },
})

export const { setCredentials, logout, setAdmin } = slice.actions

export default slice.reducer

