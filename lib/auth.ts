import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    let displayName = user.email ? user.email.split('@')[0] : user.uid;

    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(userDocRef, {
        displayName: displayName,
        username: user.displayName || displayName,
        bio: "",
        createdAt: new Date(),
      });
    } else {
      displayName = userDoc.data()?.displayName || displayName;
    }

    return { user, displayName };
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};
