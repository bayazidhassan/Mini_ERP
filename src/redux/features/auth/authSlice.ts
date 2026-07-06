import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TAuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
};

type TAuthState = {
  user: TAuthUser | null;
  accessToken: string | null;
};

const storedAuth = localStorage.getItem('auth');
const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

const initialState: TAuthState = {
  user: parsedAuth?.user || null,
  accessToken: parsedAuth?.accessToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: TAuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
