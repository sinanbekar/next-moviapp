import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";
import { setUser } from "@/features/auth/authSlice";
import { AppState } from "@/app/store";
import Router from "next/router";

export function useUserListener() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, displayName: user.displayName }));
      } else dispatch(setUser(null));
    });
    return unsubscribe;
  }, [dispatch]);
}

export function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const authSelector = (state: AppState) => state.auth;
  const userAuth = useSelector(authSelector);

  React.useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || userAuth.loading) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !userAuth?.authentication) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && userAuth?.authentication)
    ) {
      Router.push(redirectTo);
    }
  }, [userAuth, redirectIfFound, redirectTo]);

  return userAuth;
}
