import { apiSlice } from '../../app/apiSlice.js';

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomeSlides: builder.query({
      query: () => '/home-slides',
      transformResponse: (res) => res.data.items,
      providesTags: ['HomeSlide'],
    }),
    getBanners: builder.query({
      query: () => '/banners',
      transformResponse: (res) => res.data.items,
      providesTags: ['Banner'],
    }),
    getBlogs: builder.query({
      query: () => '/blogs',
      transformResponse: (res) => res.data.blogs,
      providesTags: ['Blog'],
    }),
    getBlog: builder.query({
      query: (slug) => `/blogs/${slug}`,
      transformResponse: (res) => res.data.blog,
    }),
    getSettings: builder.query({
      query: () => '/settings',
      transformResponse: (res) => res.data.settings,
      providesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetHomeSlidesQuery,
  useGetBannersQuery,
  useGetBlogsQuery,
  useGetBlogQuery,
  useGetSettingsQuery,
} = contentApi;
