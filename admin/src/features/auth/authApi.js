import { apiSlice } from '../../app/apiSlice.js';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({ url: '/auth/admin/login', method: 'POST', body: credentials }),
    }),
    refreshToken: builder.mutation({
      query: () => ({ url: '/auth/refresh-token', method: 'POST' }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useLazyGetMeQuery,
} = authApi;
