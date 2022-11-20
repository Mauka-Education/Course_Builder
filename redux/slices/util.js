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
    isPreview: {
      is: false,
      id: null,
    },
    updateSlide: {
      is: false,
      id: null,
      data: null,
    },
    logicJump: [],
    logicJumpSlides: [],
    updateLogicSlide: {
      is: false,
      id: null,
      logic_jump_id: null,
      arrno: null,
      data: null,
    },
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
      (state.updateSlide = {
        is: false,
        id: null,
        data: null,
      }),
        (state.logicJump = []),
        (state.logicJumpSlides = []);
      state.updateLogicSlide = {
        is: false,
        id: null,
        logic_jump_id: null,
        arrno: null,
        data: null,
      };
    },
    setIsPreview: (state, action) => {
      state.isPreview = { ...state.isPreview, ...action.payload };
    },
    setUpdateSlide: (state, action) => {
      state.updateSlide = { ...state.updateSlide, ...action.payload };
    },
    updateSlides: (state, action) => {
      const { id, data } = action.payload;
      const index = state?.slide?.findIndex((obj) => obj._id === id);

      if (index >= 0) {
        state.slide[index] = data;
      }
    },
    updateTestSlides: (state, action) => {
      const { id, data } = action.payload;
      const index = state?.test?.findIndex((obj) => obj._id === id);

      if (index >= 0) {
        state.test[index] = data;
      }
    },
    setLogicJump: (state, action) => {
      state.logicJump.push({ ...action.payload });
    },
    updateLogicJump: (state, action) => {
      const { id, data } = action.payload;
      const index = state.logicJump.findIndex((obj) => obj._id === id);
      if (index >= 0) state.logicJump[index] = data;
    },
    setLogicJumpSlides: (state, action) => {
      state.logicJumpSlides.push({ ...action.payload });
    },
    deleteLogicJumpSlides: (state, action) => {
      state.logicJump = state.logicJump.filter(
        (item) => item._id !== action.payload.id
      );
    },
    setUpdateLogicSlide: (state, action) => {
      state.updateLogicSlide = { ...state.updateLogicSlide, ...action.payload };
    },
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
  setLogicJump,
  updateLogicJump,
  setLogicJumpSlides,
  setUpdateLogicSlide,
  deleteLogicJumpSlides,
} = utilSlice.actions;

export default utilSlice;
