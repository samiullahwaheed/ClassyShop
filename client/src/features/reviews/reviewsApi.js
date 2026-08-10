import { apiSlice } from '../../app/apiSlice.js';

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (res) => res.data.reviews,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({ url: `/reviews/product/${productId}`, method: 'POST', body }),
      invalidatesTags: ['Review', 'Product'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const { useGetReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation } = reviewsApi;
