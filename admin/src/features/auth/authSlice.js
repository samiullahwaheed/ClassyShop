import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  status: 'idle', // idle | loading | authenticated | unauthenticated
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'unauthenticated';
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
