import {configureStore} from '@reduxjs/toolkit';
import {User} from '../models/User';
import userRedux, {UserState} from './user.slice';
import keyModelsRedux, {KeyState} from './key.slice';
import applicationSlice, {ApplicationState} from "./application.slice";
import {useDispatch} from 'react-redux';

export interface RootState {
  user: UserState
  keyModels: KeyState
  selectedApplication: ApplicationState
}

const store = configureStore({
  reducer: {
    user: userRedux,
    keyModels: keyModelsRedux,
    selectedApplication: applicationSlice
  },
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
export default store