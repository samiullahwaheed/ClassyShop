import { apiSlice } from '../../app/apiSlice.js';

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append('image', file);
        return { url: `/upload/image?folder=${folder}`, method: 'POST', body: formData };
      },
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
