import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const url = "http://localhost:3000/api/admin";
// const prodUrl = "https://lms.maukaeducation.com/api/admin";

const url=process.env.NODE_ENV==="development" ? "http://localhost:3000/api/admin" : "https://lms.maukaeducation.com/api/admin"

export const slideApi = createApi({
  reducerPath: "slide",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers,{getState}) => {
      headers.set(
        "Authorization",
        `Bearer ${getState().util.user.token}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    adminUpload:builder.mutation({
      query:(file)=>({
        url:`/upload`,
        method:"POST",
        body:file
      })
    }),
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
    updateMediaSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updatemediaslide/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateTestSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updatetestslide/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateMediaTestSlide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updatemediatestslide/${id}`,
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
    addSlideInLogic:builder.mutation({
      query:({id,logicId,data})=>({
        url:`/addslideinlogic/${id}?logic_id=${logicId}`,
        body:data,
        method:"POST"
      })
    })
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
  useChangeTestSlideOrderMutation,
  useUpdateMediaSlideMutation,
  useUpdateTestSlideMutation,
  useUpdateMediaTestSlideMutation,
  useAddSlideInLogicMutation,
  useAdminUploadMutation
} = slideApi;
