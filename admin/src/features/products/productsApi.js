import { apiSlice } from '../../app/apiSlice.js';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      transformResponse: (res) => res,
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (slug) => `/products/${slug}`,
      transformResponse: (res) => res.data.product,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getLookup: builder.query({
      query: (type) => `/products/lookups/${type}`,
      transformResponse: (res) => res.data.items,
      providesTags: ['Lookup'],
    }),
    createLookup: builder.mutation({
      query: ({ type, value }) => ({ url: `/products/lookups/${type}`, method: 'POST', body: { value } }),
      invalidatesTags: ['Lookup'],
    }),
    deleteLookup: builder.mutation({
      query: ({ type, id }) => ({ url: `/products/lookups/${type}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Lookup'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLookupQuery,
  useCreateLookupMutation,
  useDeleteLookupMutation,
} = productsApi;
