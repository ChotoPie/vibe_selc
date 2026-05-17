"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LinkItem } from "@/data/links";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconShare, IconPlus, IconLogout } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logout, signInWithGoogle } from "@/lib/auth";

// Zod & RHF
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "링크 이름을 입력해주세요." }),
  url: z.string().min(1, { message: "URL을 입력해주세요." }).refine((val) => {
    let domain = "google.com";
    try {
      const url = new URL(val.startsWith('http') ? val : `https://${val}`);
      domain = url.hostname;
      return domain.includes('.');
    } catch {
      return false;
    }
  }, { message: "올바른 URL 형식을 입력해주세요. (예: github.com)" })
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const displayName = typeof params?.displayName === "string" ? params.displayName : "";

  const [profileUid, setProfileUid] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{ username: string, bio: string } | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Zod + RHF Setup
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  // Fetch Profile & Setup Links Listener
  useEffect(() => {
    if (!displayName) return;

    const fetchProfile = async () => {
      const q = query(collection(db, "users"), where("displayName", "==", displayName));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setNotFound(true);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      setProfileUid(userDoc.id);
      setProfileData({
        username: userDoc.data().username || displayName,
        bio: userDoc.data().bio || "아직 소개글이 없습니다.",
      });

      // Links Listener
      const linksQuery = query(
        collection(db, "users", userDoc.id, "links"),
        orderBy("createdAt", "asc")
      );
      
      const unsubscribeLinks = onSnapshot(linksQuery, (snapshot) => {
        const fetchedLinks: LinkItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          url: doc.data().url,
          icon: doc.data().icon,
        }));
        setLinks(fetchedLinks);
      });

      return () => unsubscribeLinks();
    };

    fetchProfile();
  }, [displayName]);

  // Auth Listener to check ownership
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (user && profileUid && user.uid === profileUid) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    });
    return () => unsubscribeAuth();
  }, [profileUid]);

  const onSubmit = async (data: FormValues) => {
    if (!profileUid || !isOwner) return;

    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try {
      domain = new URL(formattedUrl).hostname;
    } catch {}

    try {
      await addDoc(collection(db, "users", profileUid, "links"), {
        title: data.title,
        url: formattedUrl,
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        createdAt: serverTimestamp()
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLogin = async () => {
    try {
      const { displayName: myDisplayName } = await signInWithGoogle();
      router.push(`/${myDisplayName}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (notFound) {
    return <div className="flex min-h-screen items-center justify-center">존재하지 않는 프로필입니다.</div>;
  }

  if (!profileData) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans">
      
      {/* 상단 액션 바 */}
      <div className="w-full max-w-xl flex justify-between mb-8 mt-2">
        {isOwner ? (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            <IconLogout className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        ) : (
          !isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={handleLogin} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Google 로그인
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => router.push('/')} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              내 프로필 이동
            </Button>
          )
        )}
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <IconShare stroke={1.5} className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        {/* 프로필 헤더 영역 */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10 w-full px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {profileData.username}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-sm whitespace-pre-wrap leading-relaxed font-medium">
            {profileData.bio}
          </p>
        </div>

        {/* 링크 목록 영역 */}
        <div className="w-full flex flex-col gap-3">
          
          {/* 권한이 있는 경우에만 '새 링크 추가' 버튼 렌더링 */}
          {isOwner && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) reset(); // 다이얼로그 닫힐 때 폼 초기화
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-14 rounded-[20px] border-dashed border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                  <IconPlus className="w-5 h-5 mr-2" />
                  새 링크 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>새 링크 추가</DialogTitle>
                </DialogHeader>
                {/* Zod + RHF Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>링크 이름</Label>
                    <Input
                      id="title"
                      placeholder="예: 깃허브, 블로그"
                      {...register("title")}
                      className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url" className={errors.url ? "text-red-500" : ""}>URL 주소</Label>
                    <Input
                      id="url"
                      placeholder="예: github.com/username"
                      {...register("url")}
                      className={errors.url ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.url && <p className="text-sm text-red-500 font-medium">{errors.url.message}</p>}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "추가 중..." : "추가하기"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full outline-none block"
            >
              <Card className="relative flex items-center p-4 h-[68px] transition-all duration-300 ease-out border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-[20px] group-focus-visible:ring-2 group-focus-visible:ring-zinc-900 dark:group-focus-visible:ring-zinc-300 cursor-pointer">
                
                <div className="absolute left-4 flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={link.icon}
                    alt={`${link.title} icon`}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                
                <div className="w-full flex justify-center px-14">
                  <span className="font-semibold text-[15px] tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                    {link.title}
                  </span>
                </div>
                
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-16 mb-8 text-zinc-400 dark:text-zinc-600 font-medium text-xs tracking-wider flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          Made with <span className="text-zinc-800 dark:text-zinc-200 font-bold tracking-tight">My-Link</span>
        </div>
      </div>
    </div>
  );
}
