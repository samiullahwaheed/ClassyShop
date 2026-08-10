import { apiSlice } from '../../app/apiSlice.js';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/mine',
      transformResponse: (res) => res.data.orders,
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      transformResponse: (res) => res.data.order,
      providesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderQuery } = ordersApi;
