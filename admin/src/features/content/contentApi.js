import { apiSlice } from '../../app/apiSlice.js';

// Banners, Home Slides, and Blogs share the same list/create/update/delete shape server-side,
// so one factory builds all three RTK Query slices instead of repeating each endpoint set 3x.
function buildSimpleContentApi({ name, path, tag }) {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      [`get${name}`]: builder.query({
        query: () => `/${path}`,
        transformResponse: (res) => res.data.items,
        providesTags: [tag],
      }),
      [`create${name}`]: builder.mutation({
        query: (body) => ({ url: `/${path}`, method: 'POST', body }),
        invalidatesTags: [tag],
      }),
      [`update${name}`]: builder.mutation({
        query: ({ id, ...body }) => ({ url: `/${path}/${id}`, method: 'PATCH', body }),
        invalidatesTags: [tag],
      }),
      [`delete${name}`]: builder.mutation({
        query: (id) => ({ url: `/${path}/${id}`, method: 'DELETE' }),
        invalidatesTags: [tag],
      }),
    }),
  });
}

export const bannersApi = buildSimpleContentApi({ name: 'Banners', path: 'banners', tag: 'Banner' });
export const homeSlidesApi = buildSimpleContentApi({
  name: 'HomeSlides',
  path: 'home-slides',
  tag: 'HomeSlide',
});
export const blogsApi = buildSimpleContentApi({ name: 'Blogs', path: 'blogs', tag: 'Blog' });

export const {
  useGetBannersQuery,
  useCreateBannersMutation,
  useUpdateBannersMutation,
  useDeleteBannersMutation,
} = bannersApi;

export const {
  useGetHomeSlidesQuery,
  useCreateHomeSlidesMutation,
  useUpdateHomeSlidesMutation,
  useDeleteHomeSlidesMutation,
} = homeSlidesApi;

export const {
  useGetBlogsQuery,
  useCreateBlogsMutation,
  useUpdateBlogsMutation,
  useDeleteBlogsMutation,
} = blogsApi;
