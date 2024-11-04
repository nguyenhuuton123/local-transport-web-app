import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  success: false,
  error: null,
  value: null,
}
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder)=>{}
})
export const {} = postSlice.actions;
export default postSlice.reducer;