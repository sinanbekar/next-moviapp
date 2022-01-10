import { AnyAction, createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";
import { AsyncUser, User } from "@/types/auth";
import {
  forgotPassword,
  googleLogin,
  login,
  logout,
  register,
} from "@/features/auth/authActions";

const initialState: AsyncUser = {
  data: {
    uid: null,
    displayName: null,
  },
  authentication: null,
  loading: true,
  error: null,
};

const handleStatus =
  ({
    loading = false,
    authentication = false,
  }: {
    loading?: boolean;
    authentication?: boolean;
  }) =>
  (state: Draft<AsyncUser>, action: AnyAction): void => {
    if (action.meta.requestStatus === "rejected" && action.error) {
      state.error = action.error;
    } else {
      state.error = null;
    }
    state.authentication = authentication;
    state.loading = loading;
  };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data.uid = action.payload?.uid || null;
      state.data.displayName = action.payload?.displayName || null;
      state.authentication = state.data.uid ? true : false;
      state.loading = false;
      state.error = null;
    },

    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, handleStatus({ loading: true }));
    builder.addCase(login.fulfilled, handleStatus({ authentication: true }));
    builder.addCase(login.rejected, handleStatus({}));

    builder.addCase(googleLogin.pending, handleStatus({ loading: true }));
    builder.addCase(
      googleLogin.fulfilled,
      handleStatus({ authentication: true })
    );
    builder.addCase(googleLogin.rejected, handleStatus({}));

    builder.addCase(register.pending, handleStatus({ loading: true }));
    builder.addCase(register.fulfilled, handleStatus({ authentication: true }));
    builder.addCase(register.rejected, handleStatus({}));

    builder.addCase(logout.pending, handleStatus({ loading: true }));
    builder.addCase(logout.fulfilled, handleStatus({ authentication: false }));
    builder.addCase(logout.rejected, handleStatus({}));
  },
});

export const { setUser } = authSlice.actions;
