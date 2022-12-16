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
        body:file,
        
      })
    }),
    getTotalLesson: builder.mutation({
      query: (id) => ({
        url: `/gettotallesson/${id}`,
        method: "GET",
      }),
    }),
    getSlide: builder.mutation({
      query: (id) => ({
        url: `/getslide/${id}`,
        method: "GET",
      }),
    }),
    getSlideById: builder.mutation({
      query: (id) => ({
        url: `/getslidebyid/${id}`,
        method: "GET",
      }),
    }),
    getSlideByArr: builder.mutation({
      query: (arr) => ({
        url: `/getslidesbyarr`,
        method: "POST",
        body:{arr}
      }),
    }),
    getTestSlideByArr: builder.mutation({
      query: (arr) => ({
        url: `/gettestslidesbyarr`,
        method: "POST",
        body:{arr}
      }),
    }),
    getLogicJumpSlide: builder.mutation({
      query: (id) => ({
        url: `/getlogicjumpslide/${id}`,
        method: "GET",
      }),
    }),
    getTestSlide: builder.mutation({
      query: (id) => ({
        url: `/testslide/${id}`,
        method: "GET",
      }),
    }),
    getTestLogicJumpSlide: builder.mutation({
      query: (id) => ({
        url: `/gettestlogicjumpslide/${id}`,
        method: "GET",
      }),
    }),
    changeSlideOrder: builder.mutation({
      query: ({ id1,id2,order }) => ({
        url: `/changeslideorder/${id1}/${id2}?order=${order}`,
        method: "PATCH"
      }),
    }),
    changeSlideOrderInLogicJump: builder.mutation({
      query: ({ id,from,to,logic_jump_id }) => ({
        url: `/changeslideorderinlogicjump/${id}?logic_jump_id=${logic_jump_id}&from=${from}&to=${to}`,
        method: "GET"
      }),
    }),
    changeSlideOrderInTestLogicJump: builder.mutation({
      query: ({ id,from,to,logic_jump_id }) => ({
        url: `/changeslideorderintestlogicjump/${id}?logic_jump_id=${logic_jump_id}&from=${from}&to=${to}`,
        method: "GET"
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
    deleteSlideInLogic: builder.mutation({
      query:({id,logic_jump_id,arrno,logic_jump})=>({
        url:`/deletelogicjumpslide/${id}?logic_jump_id=${logic_jump_id}&arrno=${arrno}&islogicjump=${logic_jump}`,
        method:"DELETE",
      })
    }),
    deleteTestSlideInLogic: builder.mutation({
      query:({id,logic_jump_id,arrno,logic_jump})=>({
        url:`/deletetestlogicjumpslide/${id}?logic_jump_id=${logic_jump_id}&arrno=${arrno}&islogicjump=${logic_jump}`,
        method:"DELETE",
      })
    }),
    
    initiateSlide: builder.mutation({
      query: ({id,type,slideno,order,isTest=false}) => ({
        url: `/initiateslide/${id}?type=${type}&builderslideno=${slideno}&order=${order}&isTest=${isTest}`,
        method: "GET",
      }),
    }),
    autoSaveSlide:builder.mutation({
      query:({id,data,isTest=false})=>({
        url:`/autosave/${id}?isTest=${isTest}`,
        body:{data},
        method:"POST"
      })
    }),
    autoSaveMedia:builder.mutation({
      query:({id,data,isTest=false})=>({
        url:`/autosavemedia/${id}?isTest=${isTest}`,
        body:{data},
        method:"POST"
      })
    }),
    autosaveslideinlogic:builder.mutation({
      query:({id,logic_id,slide_id,isTest=false})=>({
        url:`/autosaveslideinlogic/${id}?slide_id=${slide_id}&isTest=${isTest}`,
        body:{logic_id},
        method:"POST"
      })
    })
  }),
});

export const {
  useGetTotalLessonMutation,
  useGetTestSlideByArrMutation,
  useDeleteSlideMutation,
  useGetLogicJumpSlideMutation,
  useGetSlideMutation,
  useDeleteTestSlideMutation,
  useGetTestSlideMutation,
  useDeleteTestSlideInLogicMutation,
  useChangeSlideOrderMutation,
  useChangeSlideOrderInTestLogicJumpMutation,
  useChangeTestSlideOrderMutation,
  useAdminUploadMutation,
  useDeleteSlideInLogicMutation,
  useGetSlideByIdMutation,
  useGetSlideByArrMutation,
  useChangeSlideOrderInLogicJumpMutation,
  useGetTestLogicJumpSlideMutation,
  useInitiateSlideMutation,
  useAutoSaveSlideMutation,
  useAutoSaveMediaMutation,
  useAutosaveslideinlogicMutation
} = slideApi;