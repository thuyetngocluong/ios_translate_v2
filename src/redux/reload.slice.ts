import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReloadState {
  reloadKey: number;
}

const reloadSlice = createSlice({
  name: "reload",
  initialState: {
    reloadKey: 0,
  } as ReloadState,
  reducers: {
    reloadStateKeyModel(state, action: PayloadAction<number>) {
       
        state.reloadKey = action.payload;
    },
  },
});

export const { reloadStateKeyModel } = reloadSlice.actions;
export default reloadSlice.reducer;
