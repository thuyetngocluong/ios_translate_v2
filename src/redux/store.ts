import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import { User } from '../models/User';
import userRedux from './user.redux';
import keyModelsRedux, { KeyState } from './key.slice';
import { KeyModel } from '../models/Key';
import reloadRedux, { ReloadState } from './reload.slice';
import { useDispatch } from 'react-redux';

export interface RootState {
  user: User | null
  keyModels: KeyState
  reloadState: ReloadState
}

const store = configureStore({
  reducer: {
    user: userRedux,
    keyModels: keyModelsRedux,
    realoadState: reloadRedux
  },
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
export default store