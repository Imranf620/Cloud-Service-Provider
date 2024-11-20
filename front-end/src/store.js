import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./features/userSlice"
import fileSlice from "./features/filesSlice"


const store = configureStore({
    reducer:{
        auth:authSlice,
        files:fileSlice
    }
})

export default store;