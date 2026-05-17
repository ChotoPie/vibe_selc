"use client";

import { useEffect, useState } from "react";
import { LinkItem } from "@/data/links";
import { LinkCard } from "@/components/LinkCard";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
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

export default function Page() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<{ username: string, bio: string } | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  const loadLinks = async (uid: string) => {
    setIsLoading(true);
    try {
      const linksQuery = query(collection(db, "users", uid, "links"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(linksQuery);
      const fetchedLinks: LinkItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon,
      }));
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsLoading(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setProfileData({
              username: userDoc.data().username,
              bio: userDoc.data().bio || "",
            });
          } else {
            // 회원가입 직후 Race Condition 대응용 Fallback
            setProfileData({
              username: user.displayName || user.email?.split('@')[0] || "사용자",
              bio: "",
            });
          }
          await loadLinks(user.uid);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setProfileData(null);
        setLinks([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) return;

    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try {
      domain = new URL(formattedUrl).hostname;
    } catch {}

    try {
      await addDoc(collection(db, "users", currentUser.uid, "links"), {
        title: data.title,
        url: formattedUrl,
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        createdAt: serverTimestamp()
      });
      setIsDialogOpen(false);
      reset();
      loadLinks(currentUser.uid); // 추가 완료 후 데이터 새로고침
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // onAuthStateChanged가 후속 처리를 담당합니다.
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading && !currentUser) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // 비로그인 상태 (랜딩 및 안내 화면)
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <div className="max-w-md w-full text-center space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            My-Link
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            단 하나의 링크로 당신의 모든 것을 보여주세요.<br />
            서비스를 이용하려면 로그인해주세요.
          </p>
          <Button onClick={handleLogin} className="w-full h-14 text-md rounded-full mt-8 shadow-md" size="lg">
            Google 계정으로 시작하기
          </Button>
        </div>
      </div>
    );
  }

  // 로그인 상태 (대시보드 화면)
  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans">
      
      {/* 상단 액션 바 */}
      <div className="w-full max-w-xl flex justify-between mb-8 mt-2">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
          <IconLogout className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <IconShare stroke={1.5} className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        {/* 프로필 헤더 영역 */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10 w-full px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {profileData?.username || "사용자"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-sm whitespace-pre-wrap leading-relaxed font-medium">
            {profileData?.bio || "아직 소개글이 없습니다."}
          </p>
        </div>

        {/* 링크 목록 영역 */}
        <div className="w-full flex flex-col gap-3">
          
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

          {/* 로딩 중일 때 보여줄 스켈레톤 UI */}
          {isLoading ? (
            <div className="w-full flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[68px] w-full bg-zinc-200 dark:bg-zinc-800/50 animate-pulse rounded-[20px]" />
              ))}
            </div>
          ) : (
            links.map((link) => (
              <LinkCard key={link.id} link={link} isOwner={true} profileUid={currentUser.uid} onRefresh={() => loadLinks(currentUser.uid)} />
            ))
          )}
        </div>

        <div className="mt-16 mb-8 text-zinc-400 dark:text-zinc-600 font-medium text-xs tracking-wider flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          Made with <span className="text-zinc-800 dark:text-zinc-200 font-bold tracking-tight">My-Link</span>
        </div>
      </div>
    </div>
  );
}
