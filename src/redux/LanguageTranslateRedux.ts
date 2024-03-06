import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LanguageTranslate} from "../models/LanguageItem";

const slice = createSlice({
  name: 'test',
  initialState: [] as LanguageTranslate[],
  reducers: {
    setLanguageTranslate: (state, action) => state = action.payload,
  },
})

export const { setLanguageTranslate } = slice.actions;

export default slice.reducer;