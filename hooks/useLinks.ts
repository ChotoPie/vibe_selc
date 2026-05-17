import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/data/links";

export function useLinks(uid: string | undefined) {
  const queryClient = useQueryClient();

  const linksQuery = useQuery({
    queryKey: ["links", uid],
    queryFn: async (): Promise<LinkItem[]> => {
      if (!uid) return [];
      const q = query(collection(db, "users", uid, "links"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon,
      }));
    },
    enabled: !!uid,
  });

  const addMutation = useMutation({
    mutationFn: async (data: { title: string, url: string, domain: string }) => {
      if (!uid) throw new Error("No user ID");
      const docRef = await addDoc(collection(db, "users", uid, "links"), {
        title: data.title,
        url: data.url,
        icon: `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`,
        createdAt: serverTimestamp()
      });
      return {
        id: docRef.id,
        title: data.title,
        url: data.url,
        icon: `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`,
      };
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] });
      const previousLinks = queryClient.getQueryData<LinkItem[]>(["links", uid]);

      const optimisticLink: LinkItem = {
        id: Math.random().toString(), // 화면에 즉시 보일 임시 ID
        title: newData.title,
        url: newData.url,
        icon: `https://www.google.com/s2/favicons?domain=${newData.domain}&sz=128`,
      };

      queryClient.setQueryData<LinkItem[]>(["links", uid], old => old ? [...old, optimisticLink] : [optimisticLink]);
      return { previousLinks };
    },
    onError: (err, newData, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string, title: string, url: string, domain: string }) => {
      if (!uid) throw new Error("No user ID");
      await updateDoc(doc(db, "users", uid, "links", data.id), {
        title: data.title,
        url: data.url,
        icon: `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`,
      });
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] });
      const previousLinks = queryClient.getQueryData<LinkItem[]>(["links", uid]);

      queryClient.setQueryData<LinkItem[]>(["links", uid], old => 
        old?.map(link => 
          link.id === newData.id 
            ? { ...link, title: newData.title, url: newData.url, icon: `https://www.google.com/s2/favicons?domain=${newData.domain}&sz=128` }
            : link
        )
      );
      return { previousLinks };
    },
    onError: (err, newData, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId: string) => {
      if (!uid) throw new Error("No user ID");
      await deleteDoc(doc(db, "users", uid, "links", linkId));
    },
    onMutate: async (linkId) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] });
      const previousLinks = queryClient.getQueryData<LinkItem[]>(["links", uid]);

      queryClient.setQueryData<LinkItem[]>(["links", uid], old => 
        old?.filter(link => link.id !== linkId)
      );
      return { previousLinks };
    },
    onError: (err, linkId, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
    },
  });

  return {
    links: linksQuery.data || [],
    isLoading: linksQuery.isLoading,
    addLink: addMutation.mutate,
    isAdding: addMutation.isPending,
    updateLink: updateMutation.mutate,
    deleteLink: deleteMutation.mutate,
  };
}
