import { createSlice } from "@reduxjs/toolkit";

const utilSlice = createSlice({
  name: "util",
  initialState: {
    winWidth: 0,
    activeStep: 0,
    initiated: {
      once: false,
      refactor: false,
    },
    course: {},
    preRequisite: [],
    slide: [],
    test: [],
    user: {},
    isPreview:{
      is:false,
      id:null 
    },
    updateSlide:{
      is:false,
      id:null,
      data:null
    },
    logicJump:[]
  },
  reducers: {
    setWinWidth: (state, action) => {
      state.winWidth = action.payload;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setInitiated: (state, action) => {
      state.initiated = { ...state.initiated, ...action.payload };
    },
    setCourseData: (state, action) => {
      state.course = { ...state.course, ...action.payload };
    },
    setPreRequisite: (state, action) => {
      state.preRequisite = action.payload;
    },
    setSlideData: (state, action) => {
      state.slide = action.payload;
    },
    setTestData: (state, action) => {
      state.test = action.payload;
    },
    setAdmin: (state, action) => {
      state.user = action.payload;
    },
    clearCourse: (state) => {
      state.winWidth = 0;
      state.activeStep = 0;
      state.initiated = {
        once: false,
        refactor: false,
      };
      state.course = {};
      state.preRequisite = [];
      state.slide = [];
      state.test = [];
      state.updateSlide={
        is:false,
        id:null,
        data:null
      },
      state.logicJump=[]
    },
    setIsPreview: (state,action)=>{
      state.isPreview= {  ...state.isPreview,...action.payload}
    },
    setUpdateSlide:(state,action)=>{
      state.updateSlide={...state.updateSlide,...action.payload}
    },
    updateSlides:(state,action)=>{
      const {id,data}=action.payload
      const index=state?.slide?.findIndex(obj=>obj._id===id)
      
      console.log({action})
      if(index>=0){
        state.slide[index]=data
        
      }      
    },
    updateTestSlides:(state,action)=>{
      const {id,data}=action.payload
      const index=state?.test?.findIndex(obj=>obj._id===id)
      
      
      if(index>=0){
        state.test[index]=data
        
      }      
    },
    setLogicJump:(state,action)=>{
      
      state.logicJump.push({...action.payload})
    }
  },
});

export const {
  setWinWidth,
  setActiveStep,
  setInitiated,
  setCourseData,
  setPreRequisite,
  setSlideData,
  setIsPreview,
  setAdmin,
  setTestData,
  clearCourse,
  setUpdateSlide,
  updateSlides,
  updateTestSlides,
  setLogicJump
  
} = utilSlice.actions;

export default utilSlice;
