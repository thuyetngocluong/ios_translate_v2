import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../models/User";
import { KeyModel } from "../models/Key";
import axios from "axios";
import Const from "../Utils/Const";
import KeyService from "../services/KeyService";

export interface KeyState {
  value: KeyModel[];
}

export const fetchKeys = createAsyncThunk("key/fetch", async () =>  {
  const response = await KeyService.shared.fetch();
  return response
});

const keySlice = createSlice({
  name: "key",
  initialState: {
    value: [],
  } as KeyState,
  reducers: {
    // reloadKeyModel(state, action: PayloadAction<KeyModel[]>) {
    //   state.value = action.payload
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchKeys.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});

export default keySlice.reducer;
