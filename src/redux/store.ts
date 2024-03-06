import { configureStore } from '@reduxjs/toolkit';
import languageTranslateRedux from "./LanguageTranslateRedux";
import {LanguageTranslate} from "../models/LanguageItem";

export interface RootState {
  languageTranslate: LanguageTranslate[]; // Define the type for the slice state
}
export default configureStore({
  reducer: {
    languageTranslate: languageTranslateRedux,
  },
});