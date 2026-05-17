"use client";

import { useEffect, useState } from "react";
import { LinkItem } from "@/data/links";
import { LinkCard } from "@/components/LinkCard";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
  // 원래 사용하시던 고정 프로필 데이터
  const profileData = {
    username: "개발자 홍길동",
    bio: "프론트엔드 개발자입니다.\n좋은 사용자 경험(UX)을 만드는 데 관심이 많습니다.",
  };

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  // 링크 조회: 기존에 저장하시던 'users/anonymous/links' 경로 유지
  useEffect(() => {
    const linksQuery = query(
      collection(db, "users", "anonymous", "links"),
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
      setIsLoading(false);
    });

    return () => unsubscribeLinks();
  }, []);

  // 로그인 상태 확인 (로그인한 사람이면 일단 추가 버튼을 볼 수 있게 처리)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!isOwner) return;

    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try {
      domain = new URL(formattedUrl).hostname;
    } catch {}

    try {
      await addDoc(collection(db, "users", "anonymous", "links"), {
        title: data.title,
        url: formattedUrl,
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        createdAt: serverTimestamp()
      });
      setIsDialogOpen(false);
      reset();
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
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

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
          <Button variant="outline" size="sm" onClick={handleLogin} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Google 로그인
          </Button>
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

          {/* 로딩 중일 때 보여줄 스켈레톤 UI */}
          {isLoading ? (
            <div className="w-full flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[68px] w-full bg-zinc-200 dark:bg-zinc-800/50 animate-pulse rounded-[20px]" />
              ))}
            </div>
          ) : (
            links.map((link) => (
              <LinkCard key={link.id} link={link} isOwner={isOwner} />
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
