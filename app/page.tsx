"use client";

import { useEffect, useState } from "react";
import { LinkCard } from "@/components/LinkCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconShare, IconPlus, IconLogout, IconLink, IconBrandGoogle, IconLayoutDashboard, IconDeviceDesktopAnalytics, IconChartBar, IconUser } from "@tabler/icons-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logout, signInWithGoogle, handleAuthRedirect } from "@/lib/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinks } from "@/hooks/useLinks";
import { useProfile } from "@/hooks/useProfile";

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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  useEffect(() => {
    // 리다이렉트 로그인 결과 처리
    handleAuthRedirect().catch(console.error);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const { links, isLoading: isLinksLoading, addLink, isAdding } = useLinks(currentUser?.uid);

  const onSubmit = (data: FormValues) => {
    if (!currentUser) return;
    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try { domain = new URL(formattedUrl).hostname; } catch {}

    addLink({ title: data.title, url: formattedUrl, domain });
    setIsDialogOpen(false); // 낙관적 업데이트로 로딩 대기 없이 즉시 닫기
    reset();
  };

  const handleLogout = async () => { await logout(); };

  const { profile } = useProfile(currentUser?.uid);

  const handleShare = () => {
    if (!profile?.displayName) {
      alert("프로필 정보가 아직 로드되지 않았습니다.");
      return;
    }
    const url = `${window.location.origin}/${profile.displayName}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("공유 링크가 클립보드에 복사되었습니다!");
    }).catch(() => {
      alert("링크 복사에 실패했습니다.");
    });
  };

  const handleLogin = async () => {
    try {
      // setIsAuthLoading(true)를 여기서 호출하면 React 렌더링 틱이 발생하여 
      // 브라우저의 동기적 사용자 제스처(User Gesture) 컨텍스트가 끊어져 팝업 차단이 발생할 수 있습니다.
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setIsAuthLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">Loading...</div>;
  }

  // 비로그인 상태 (랜딩 및 안내 화면)
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
        {/* 헤더/히어로 영역 */}
        <div className="flex flex-col items-center justify-center flex-grow p-6 relative overflow-hidden min-h-[70vh]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-md w-full text-center space-y-8 relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-200 dark:border-zinc-800 mb-2">
              <IconLink stroke={2.5} className="w-10 h-10 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              My-Link
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl leading-relaxed">
              단 하나의 링크로 당신의 모든 것을 보여주세요.<br />
              지금 바로 시작하고 나만의 페이지를 만드세요.
            </p>
            <Button onClick={handleLogin} className="w-full h-14 text-md rounded-full mt-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" size="lg">
              <IconBrandGoogle className="w-5 h-5 mr-2" />
              Google 계정으로 시작하기
            </Button>
          </div>
        </div>

        {/* 특징(Features) 영역 */}
        <div className="w-full bg-white dark:bg-zinc-900 py-24 px-6 border-t border-zinc-200 dark:border-zinc-800 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">왜 My-Link를 선택해야 할까요?</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">복잡한 설정 없이 단 1분 만에 완성되는 모던한 포트폴리오</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <IconLayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">초간편 관리</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  직관적인 대시보드를 통해 클릭 몇 번으로 링크를 추가하고 실시간으로 수정하세요.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <IconDeviceDesktopAnalytics className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">모던한 디자인</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  주소를 입력하면 구글 API를 통해 사이트 로고를 자동으로 추출하여 세련되게 보여줍니다.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                  <IconShare className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">쉬운 공유</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  인스타그램, 틱톡, 깃허브 등 나만의 채널 어디서든 하나의 링크로 연결하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="w-full py-10 bg-white dark:bg-zinc-900 text-center text-sm text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-800/50">
          <p>© {new Date().getFullYear()} My-Link. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // 로그인 상태 (대시보드 화면)
  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans">
      
      {/* 상단 액션 바 */}
      <div className="w-full max-w-xl flex justify-between mb-8 mt-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.photoURL || undefined} alt={profile?.username || currentUser.email || ""} />
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {(profile?.username || currentUser.email || "?").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.username || "사용자"}</p>
                <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => {
              if (profile?.displayName) window.open(`/${profile.displayName}`, '_blank');
            }}>
              <IconUser className="mr-2 h-4 w-4" />
              <span>내 프로필 보기</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/stats')}>
              <IconChartBar className="mr-2 h-4 w-4" />
              <span>통계 대시보드</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400" onClick={handleLogout}>
              <IconLogout className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors" title="내 페이지 공유하기">
          <IconShare stroke={1.5} className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        {/* 프로필 헤더 영역 (인라인 수정 컴포넌트) */}
        <ProfileHeader uid={currentUser.uid} />

        {/* 링크 목록 영역 */}
        <div className="w-full flex flex-col gap-3">
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
                <LinkCard key={link.id} link={link} isOwner={true} profileUid={currentUser.uid} />
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
