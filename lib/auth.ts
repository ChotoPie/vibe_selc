import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

// 고유한 displayName을 생성하는 헬퍼 함수
async function getUniqueDisplayName(baseName: string): Promise<string> {
  let displayName = baseName;
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const q = query(collection(db, "users"), where("displayName", "==", displayName));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      isUnique = true;
    } else {
      counter++;
      displayName = `${baseName}${counter}`;
    }
  }
  return displayName;
}

// Firestore에 유저 정보 동기화 (없으면 생성, 누락 시 백필)
export const syncUserProfile = async (user: User) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  let baseDisplayName = user.email ? user.email.split('@')[0] : user.uid.substring(0, 8);
  let displayName = baseDisplayName;

  if (!userDoc.exists()) {
    displayName = await getUniqueDisplayName(baseDisplayName);
    await setDoc(userDocRef, {
      displayName: displayName,
      username: user.displayName || displayName,
      bio: "",
      createdAt: new Date(),
    });
  } else {
    const data = userDoc.data();
    if (!data?.displayName) {
      displayName = await getUniqueDisplayName(baseDisplayName);
      await setDoc(userDocRef, { displayName: displayName }, { merge: true });
    } else {
      displayName = data.displayName;
    }
  }
  return displayName;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const displayName = await syncUserProfile(result.user);
    return { user: result.user, displayName };
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      alert("브라우저 팝업 차단이 감지되었습니다!\n\n주소창 우측(또는 좌측)의 🚫 팝업 차단 아이콘을 클릭하여 '항상 허용'으로 변경한 후 다시 시도해 주세요.");
    }
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
