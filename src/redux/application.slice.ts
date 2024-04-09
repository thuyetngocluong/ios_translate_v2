import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Application} from "../models/Application";
import AuthService from "../services/AuthService";
import {ApplicationService} from "../services/ApplicationService";
import Const from "../Utils/Const";

export interface ApplicationState {
  value: Application | null;
}

export const reloadApplication = createAsyncThunk("application/fetch", async () =>  {
  const applicationID = Const.currentApplicationID()
  if (applicationID) {
    return await ApplicationService.shared.fetchApplication(applicationID)
  }
  return null
});

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    value: AuthService.shared.currentUser?.applications.find(e => e.id.toString() === localStorage.getItem("applicationId")),
  } as ApplicationState,
  reducers: {
    setSelectApplication: (state, action) => {
      localStorage.setItem("applicationID", action.payload?.id);
      state.value = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reloadApplication.fulfilled, (state, action) => {
      if (action.payload) {
        state.value = action.payload
      }
    });
  },
});

export const { setSelectApplication } = applicationSlice.actions

export default applicationSlice.reducer;
