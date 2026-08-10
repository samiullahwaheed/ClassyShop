import { apiSlice } from '../../app/apiSlice.js';

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (params) => ({ url: '/categories', params }),
      transformResponse: (res) => res.data.categories,
      providesTags: ['Category'],
    }),
    getCategory: builder.query({
      query: (slug) => `/categories/${slug}`,
      transformResponse: (res) => res.data.category,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoriesApi;
