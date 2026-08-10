import { apiSlice } from '../../app/apiSlice.js';

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      transformResponse: (res) => res.data.settings,
      providesTags: ['Settings'],
    }),
    updateLogo: builder.mutation({
      query: (logo) => ({ url: '/settings/logo', method: 'PATCH', body: { logo } }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateLogoMutation } = settingsApi;
