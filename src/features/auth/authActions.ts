import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/app/firebase";
import { SigninInfo, SignupInfo } from "@/types/auth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: SigninInfo) => {
    await signInWithEmailAndPassword(auth, email, password);
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, displayName }: SignupInfo) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    if (displayName) updateProfile(user, { displayName });
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }
);

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
});
