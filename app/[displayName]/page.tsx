"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { IconShare, IconPlus, IconLogout } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logout, signInWithGoogle } from "@/lib/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";

// Hooks & Components
import { useProfileByDisplayName } from "@/hooks/useProfileByDisplayName";
import { useLinks } from "@/hooks/useLinks";
import { ProfileHeader } from "@/components/ProfileHeader";
import { LinkCard } from "@/components/LinkCard";

const formSchema = z.object({
  title: z.string().min(1, { message: "링크 이름을 입력해주세요." }),
  url: z.string().min(1, { message: "URL을 입력해주세요." }).refine((val) => {
    try {
      const url = new URL(val.startsWith('http') ? val : `https://${val}`);
      return url.hostname.includes('.');
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

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Zod + RHF Setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch Profile & Links using TanStack Query
  const { data: profileResult, isLoading: isProfileLoading } = useProfileByDisplayName(displayName);
  const profileUid = profileResult?.uid;
  const { links, isLoading: isLinksLoading, addLink, isAdding } = useLinks(profileUid);

  // 본인 여부 확인
  const isOwner = !!currentUser && !!profileUid && currentUser.uid === profileUid;

  const onSubmit = (data: FormValues) => {
    if (!profileUid || !isOwner) return;

    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try { domain = new URL(formattedUrl).hostname; } catch {}

    addLink({ title: data.title, url: formattedUrl, domain });
    setIsDialogOpen(false);
    reset();
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

  // 404 처리 (데이터 페칭 완료 후 유저를 못 찾은 경우)
  if (!isProfileLoading && profileResult === null) {
    notFound(); // next/navigation을 통해 404 에러 페이지로 직행
  }

  if (isAuthLoading || isProfileLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">Loading...</div>;
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
          !currentUser ? (
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
        {profileUid && (
          <ProfileHeader uid={profileUid} isOwner={isOwner} />
        )}

        {/* 링크 목록 영역 */}
        <div className="w-full flex flex-col gap-3">
          
          {/* 권한이 있는 경우에만 '새 링크 추가' 버튼 렌더링 */}
          {isOwner && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) reset();
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
                    <Button type="submit" disabled={isAdding}>
                      {isAdding ? "추가 중..." : "추가하기"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* 로딩 중일 때 보여줄 스켈레톤 UI */}
          {isLinksLoading ? (
            <div className="w-full flex flex-col gap-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[68px] w-full bg-zinc-200 dark:bg-zinc-800/50 animate-pulse rounded-[20px]" />
              ))}
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {links.map((link) => (
                <LinkCard 
                  key={link.id} 
                  link={link} 
                  isOwner={isOwner} 
                  profileUid={profileUid!} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 mb-8 text-zinc-400 dark:text-zinc-600 font-medium text-xs tracking-wider flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          Made with <span className="text-zinc-800 dark:text-zinc-200 font-bold tracking-tight">My-Link</span>
        </div>
      </div>
    </div>
  );
}
