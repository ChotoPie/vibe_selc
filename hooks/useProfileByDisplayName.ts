import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProfileData } from "./useProfile";

export interface ProfileFetchResult {
  uid: string;
  profile: ProfileData;
}

export function useProfileByDisplayName(displayName: string | undefined) {
  return useQuery({
    queryKey: ["profileByDisplayName", displayName],
    queryFn: async (): Promise<ProfileFetchResult | null> => {
      if (!displayName) return null;
      const q = query(collection(db, "users"), where("displayName", "==", displayName));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null; // 사용자를 찾을 수 없음 (404 처리용)
      }

      const userDoc = snapshot.docs[0];
      return {
        uid: userDoc.id,
        profile: {
          displayName: userDoc.data().displayName || "",
          username: userDoc.data().username || "",
          bio: userDoc.data().bio || "",
        }
      };
    },
    enabled: !!displayName,
    retry: false, // 404 처리를 빠르게 하기 위해 재시도 비활성화
  });
}
