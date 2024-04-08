import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";

type UserOrNull = User | null

const userSlice = createSlice({
    name: 'user',
    initialState: null as UserOrNull,
    reducers: {
      updateUser: (state, action) => state = action.payload,
    },
  })
  
  export const {  updateUser } = userSlice.actions
  export default userSlice.reducer