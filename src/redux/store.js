import { configureStore } from "@reduxjs/toolkit";
import auth from "./userslice";

export const store = configureStore({
reducer:{
    user:auth
}
})