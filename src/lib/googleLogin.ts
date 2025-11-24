"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;
    const idToken = await user.getIdToken();

    return { user, idToken };
};
