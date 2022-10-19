
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url ="http://localhost:3000/api/admin"
const prodUrl="https://lms.maukaeducation.com/api/admin"

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
    createSlide:builder.mutation({
        query:({id,data})=>({
            url:`/addslide/${id}`,
            method:"POST",
            body:data
        })
    }),
    createTestSlide: builder.mutation({
      query:({id,data})=>({
        url:`/testslide/${id}`,
        method:"POST",
        body: data
      })
    })
  }),
});

export const {
  useCreateSlideMutation,
  useCreateTestSlideMutation
} = slideApi;
