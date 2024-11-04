import {configureStore} from "@reduxjs/toolkit";
import PostSlice from "../features/PostSlice";

export const store = configureStore({
  reducer: {
    post: PostSlice,
  }
});