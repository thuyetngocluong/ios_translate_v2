import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {KeyModel} from "../models/Key";
import KeyService from "../services/KeyService";

export interface KeyState {
  value: KeyModel[];
}

export const fetchKeys = createAsyncThunk("key/fetch", async () =>  {
  return await KeyService.shared.fetch()
});

const keySlice = createSlice({
  name: "key",
  initialState: {
    value: [],
  } as KeyState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchKeys.fulfilled, (state, action) => {
      console.log(action.payload)
      state.value = action.payload;
    });
  },
});

export default keySlice.reducer;
