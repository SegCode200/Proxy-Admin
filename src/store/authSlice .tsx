import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";

interface User {
  admin: {
    email: string;
    id: string;
    name: string;
    role: string;
  };
  token: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logoutState: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutState } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
