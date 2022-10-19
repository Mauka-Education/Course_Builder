import { configureStore,getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import storage from "redux-persist/lib/storage";
import {persistReducer,persistStore} from "redux-persist";
import thunk from "redux-thunk";
import utilSlice from "./slices/util";
import { courseApi } from "./slices/course";
import { slideApi } from "./slices/slide";


export const rootReducer=combineReducers({
    util:utilSlice.reducer,
    course: courseApi.reducer,
    slide: slideApi.reducer
})

const persistConfig={
    key:"root",
    storage,
    blacklist:["course","slide"]
}

const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store=configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV!=="production",
    middleware:[thunk]
})

export const persistor=persistStore(store)
