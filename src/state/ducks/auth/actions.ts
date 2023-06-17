import {
  register as registerService,
  login as loginService,
  logout as logoutService,
} from '../../../network/auth/authServies';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorType } from '../../../types/errors';
import { LoginType, AuthType } from '../../../types';

const REGISTER = 'auth/register';
const LOGIN = 'auth/login';
const LOGOUT = 'auth/logout';

export const register = createAsyncThunk<boolean | ErrorType | void, AuthType>(
  REGISTER,
  async (data) => {
    const response = await registerService(data);
    return response;
  }
);

export const login = createAsyncThunk<LoginType | ErrorType, AuthType>(
  LOGIN,
  async (data) => {
    const response = await loginService(data);
    return response;
  }
);

export const logout = createAsyncThunk<void | ErrorType>(LOGOUT, async () => {
  const response = await logoutService();
  return response;
});
