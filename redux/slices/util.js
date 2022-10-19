import { createSlice } from "@reduxjs/toolkit";

const utilSlice=createSlice({
    name:"util",
    initialState:{
        winWidth:0,
        activeStep:0,
        initiated:{
            once:false,
            refactor:false
        },
        course:{},
        preRequisite:[],
        slide:[],
        user:{}
    },
    reducers:{
        setWinWidth:(state,action)=>{
            state.winWidth=action.payload
        },
        setActiveStep:(state,action)=>{
            state.activeStep=action.payload
        },
        setInitiated:(state,action)=>{
            state.initiated= {  ...state.initiated , ...action.payload}
        },
        setCourseData: (state,action)=>{
            state.course={ ...state.course,...action.payload}
        },
        setPreRequisite:(state,action)=>{
            state.preRequisite=action.payload
        },
        setSlideData:(state,action)=>{
            state.slide=action.payload
        },
        setAdmin: (state,action)=>{
            state.user=action.payload
        }
    }
})

export const {setWinWidth,setActiveStep,setInitiated,setCourseData,setPreRequisite,setSlideData,setAdmin}=utilSlice.actions

export default utilSlice