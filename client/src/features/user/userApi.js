import { apiSlice } from '../../app/apiSlice.js';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (res) => res.data.user,
      providesTags: ['Me'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: '/users/me/change-password', method: 'PATCH', body }),
    }),
    getAddresses: builder.query({
      query: () => '/users/me/addresses',
      transformResponse: (res) => res.data.addresses,
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation({
      query: (body) => ({ url: '/users/me/addresses', method: 'POST', body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, ...body }) => ({ url: `/users/me/addresses/${addressId}`, method: 'PATCH', body }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({ url: `/users/me/addresses/${addressId}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
    getWishlist: builder.query({
      query: () => '/users/me/wishlist',
      transformResponse: (res) => res.data.wishlist,
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({ url: `/users/me/wishlist/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/users/me/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = userApi;
