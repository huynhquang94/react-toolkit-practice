import { configureStore, ThunkAction, Action, AnyAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import authReducer from '../features/auth/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: [thunkMiddleware],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AppThunkAction = ThunkAction<void, RootState, null, AnyAction>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();