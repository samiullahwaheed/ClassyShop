import { apiSlice } from '../../app/apiSlice.js';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/dashboard/stats',
      transformResponse: (res) => res.data,
      providesTags: ['Dashboard'],
    }),
    getSalesChart: builder.query({
      query: (year) => ({ url: '/dashboard/sales-chart', params: year ? { year } : {} }),
      transformResponse: (res) => res.data,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetStatsQuery, useGetSalesChartQuery } = dashboardApi;
