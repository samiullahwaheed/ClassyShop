import { apiSlice } from '../../app/apiSlice.js';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (slug) => `/products/${slug}`,
      transformResponse: (res) => res.data.product,
      providesTags: ['Product'],
    }),
    getRelatedProducts: builder.query({
      query: (id) => `/products/related/${id}`,
      transformResponse: (res) => res.data.products,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetRelatedProductsQuery } = productsApi;
