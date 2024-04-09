import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import { User } from '../models/User';
import userRedux from './user.redux';
import keyModelsRedux, { KeyState } from './key.slice';
import { KeyModel } from '../models/Key';
import { useDispatch } from 'react-redux';

export interface RootState {
  user: User | null
  keyModels: KeyState
}

const store = configureStore({
  reducer: {
    user: userRedux,
    keyModels: keyModelsRedux,
  },
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
export default store