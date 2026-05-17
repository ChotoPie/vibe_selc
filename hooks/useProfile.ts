import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProfileData {
  displayName: string;
  username: string;
  bio: string;
}

export function useProfile(uid: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", uid],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!uid) return null;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return {
          displayName: userDoc.data().displayName || "",
          username: userDoc.data().username || "",
          bio: userDoc.data().bio || "",
        };
      }
      return null;
    },
    enabled: !!uid, // uid가 있을 때만 쿼리 실행
  });

  const updateMutation = useMutation({
    mutationFn: async (newData: ProfileData) => {
      if (!uid) throw new Error("No user ID");
      await updateDoc(doc(db, "users", uid), {
        displayName: newData.displayName,
        username: newData.username,
        bio: newData.bio,
      });
    },
    onMutate: async (newData) => {
      // 1. 진행 중인 조회 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["profile", uid] });

      // 2. 에러 롤백을 위해 이전 데이터 백업
      const previousProfile = queryClient.getQueryData<ProfileData>(["profile", uid]);

      // 3. 캐시 데이터를 새 데이터로 즉시 변경 (낙관적 업데이트)
      queryClient.setQueryData<ProfileData>(["profile", uid], newData);

      return { previousProfile };
    },
    onError: (err, newData, context) => {
      // 에러 발생 시 이전 상태로 복구
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", uid], context.previousProfile);
      }
    },
    onSettled: () => {
      // 작업 완료 후 무조건 서버 데이터와 한 번 더 동기화
      queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: updateMutation.mutate,
  };
}
