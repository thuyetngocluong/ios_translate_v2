import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {User} from "../models/User";
import Const from "../Utils/Const";
import {ApplicationService} from "../services/ApplicationService";
import AuthService from "../services/AuthService";
import {reloadApplication} from "./application.slice";

export interface UserState {
  value: User | null
}

export const reloadCurrentUser = createAsyncThunk("user/fetch", async () =>  {
  return await AuthService.shared.checkAuthenticate()
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
      value: null
    } as UserState,
    reducers: {
      updateUser: (state, action) => {
        state.value = action.payload
      },
    },
    extraReducers: (builder) => {
      builder.addCase(reloadCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.value = action.payload
        }
      });
  },
  })
  
  export const {  updateUser } = userSlice.actions
  export default userSlice.reducer