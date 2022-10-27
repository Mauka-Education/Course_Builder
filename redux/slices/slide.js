import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "http://localhost:3000/api/admin";
const prodUrl = "https://lms.maukaeducation.com/api/admin";

export const slideApi = createApi({
  reducerPath: "slide",
  baseQuery: fetchBaseQuery({
    baseUrl: prodUrl,
    prepareHeaders: (headers) => {
      headers.set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNlNmFhMTc5YjBjYWUwNjBmNzhlZjMiLCJpYXQiOjE2NjYxNzIwNzZ9.5GM6sfq5NvO384VjywFKaUTO2QpSkWwHUi3nnPk6M6c`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSlide: builder.mutation({
      query: (id) => ({
        url: `/getslide/${id}`,
        method: "GET",
      }),
    }),
    getTestSlide: builder.mutation({
      query: (id) => ({
        url: `/testslide/${id}`,
        method: "GET",
      }),
    }),
    createSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/addslide/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    createTestSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/testslide/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    updateSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateslide/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    changeSlideOrder: builder.mutation({
      query: ({ id1,id2,order }) => ({
        url: `/changeslideorder/${id1}/${id2}?order=${order}`,
        method: "PATCH"
      }),
    }),
    changeTestSlideOrder: builder.mutation({
      query: ({ id1,id2,order }) => ({
        url: `/changetestslideorder/${id1}/${id2}?order=${order}`,
        method: "PATCH"
      }),
    }),
    deleteSlide: builder.mutation({
      query: (id) => ({
        url: `/deleteslide/${id}`,
        method: "DELETE",
      }),
    }),
    deleteTestSlide: builder.mutation({
      query: (id) => ({
        url: `/testslide/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateSlideMutation,
  useCreateTestSlideMutation,
  useDeleteSlideMutation,
  useGetSlideMutation,
  useDeleteTestSlideMutation,
  useGetTestSlideMutation,
  useUpdateSlideMutation,
  useChangeSlideOrderMutation,
  useChangeTestSlideOrderMutation
} = slideApi;
