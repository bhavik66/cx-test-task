import { createSlice } from '@reduxjs/toolkit';
import { ErrorType } from '../../../types/errors';
import { isSPError } from '../../../utils/errors';
import { login, logout } from './actions';

interface AuthState {
  auth: {
    isLoading: boolean;
    error: ErrorType | undefined;
    token: string;
  };
}

const initialState: AuthState = {
  auth: {
    token: '',
    error: undefined,
    isLoading: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearToken(state) {
      state.auth.token = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.auth.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.auth.token = action.payload.token;
          state.auth.error = undefined;
        } else {
          state.auth.error = action.payload;
        }
        state.auth.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.auth.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.auth.token = '';
          state.auth.error = undefined;
        } else {
          state.auth.error = action.payload;
        }
        state.auth.isLoading = false;
      });
  },
});

export const { clearToken } = authSlice.actions;
export default authSlice.reducer;
