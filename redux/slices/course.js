import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url ="http://localhost:3000/api/admin"
const prodUrl="https://lms.maukaeducation.com/api/admin"

export const courseApi = createApi({
  reducerPath: "course",
  baseQuery: fetchBaseQuery({
    baseUrl: prodUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNlNmFhMTc5YjBjYWUwNjBmNzhlZjMiLCJpYXQiOjE2NjYxNzIwNzZ9.5GM6sfq5NvO384VjywFKaUTO2QpSkWwHUi3nnPk6M6c`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({
        url: "/courses",
      }),
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/addcourse",
        method: "POST",
        body: data,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ data, id }) => ({
        url: `/addcourse/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    addLesson: builder.mutation({
      query: ({ data, id }) => ({
        url: `/addlesson/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    updateLesson: builder.mutation({
      query: ({ data, id }) => ({
        url: `/updatelesson/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/deletelesson/${id}`,
        method: "DELETE",
      }),
    }),
    addAssignment: builder.mutation({
      query: (data) => ({
        url: `/addassignment`,
        method: "POST",
        body: data,
      }),
    }),
    updateAssignment: builder.mutation({
      query: ({ data, id }) => ({
        url: `/updateassignment/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/deleteassignment/${id}`,
        method: "DELETE",
      }),
    }),
    addTest: builder.mutation({
      query: (data) => ({
        url: "/addtest",
        method: "POST",
        body: data,
      }),
    }),
    updateTest: builder.mutation({
      query: ({ data, id }) => ({
        url: `/updatetest/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/deletetest/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateAssignmentMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useAddLessonMutation,
  useAddAssignmentMutation,
  useGetCoursesQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useDeleteAssignmentMutation,
  useAddTestMutation,
  useDeleteTestMutation,
  useUpdateTestMutation,
} = courseApi;
