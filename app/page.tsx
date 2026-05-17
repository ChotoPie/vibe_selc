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
import { logout, signInWithGoogle } from "@/lib/auth";
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
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 overflow-x-hidden">
        
        {/* 헤더/히어로 영역 */}
        <div className="relative w-full flex flex-col items-center justify-center pt-24 pb-20 md:pt-32 md:pb-32 px-6 overflow-hidden">
          {/* Background Glows (stats 페이지와 통일된 톤다운/부드러운 블러) */}
          <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* 좌측: 타이포그래피 및 CTA */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-full shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 mb-2">
                <IconLink stroke={2.5} className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">단 하나의 멀티 링크 서비스</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1]">
                당신의 모든 것을<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                  하나의 링크로
                </span>
              </h1>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg">
                인스타그램, 틱톡, 깃허브, 블로그까지.<br />
                흩어져 있는 나의 채널들을 1분 만에 깔끔하게 모아보세요.
              </p>
              
              <div className="w-full sm:w-auto pt-4">
                <Button onClick={handleLogin} className="w-full sm:w-auto h-14 px-8 text-md rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" size="lg">
                  <IconBrandGoogle className="w-5 h-5 mr-2" />
                  Google 계정으로 무료 시작
                </Button>
              </div>
            </div>

            {/* 우측: 플로팅 모바일 목업 (Fun 요소) */}
            <div className="relative hidden lg:flex justify-center items-center w-full animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="relative w-[300px] h-[600px] bg-white dark:bg-zinc-950 rounded-[40px] shadow-2xl border-8 border-zinc-100 dark:border-zinc-800 flex flex-col items-center p-6 overflow-hidden animate-[bounce_8s_ease-in-out_infinite]">
                {/* 목업 내부 장식 요소 */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mt-6 mb-4 shadow-inner" />
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-2" />
                <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full mb-10" />
                
                <div className="w-full space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-14 rounded-[20px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center px-4 gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    </div>
                  ))}
                </div>
                
                {/* 목업 글래스 빛 반사 효과 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 pointer-events-none" />
              </div>
              
              {/* 장식용 떠다니는 아이콘들 */}
              <div className="absolute top-20 -left-6 bg-white dark:bg-zinc-800 p-3 rounded-2xl shadow-xl animate-[bounce_6s_ease-in-out_infinite_reverse]">
                <IconShare className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="absolute bottom-32 -right-6 bg-white dark:bg-zinc-800 p-3 rounded-2xl shadow-xl animate-[bounce_7s_ease-in-out_infinite]">
                <IconChartBar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 특징(Features) 영역 */}
        <div className="w-full bg-white dark:bg-zinc-900 py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">쉽고 빠르고 아름답게.</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">My-Link가 제공하는 차별화된 경험</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group flex flex-col items-center text-center p-10 rounded-[32px] bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <IconLayoutDashboard className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">초간편 관리</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  직관적인 대시보드를 통해 클릭 몇 번으로 링크를 추가하고 실시간으로 수정하세요.
                </p>
              </div>

              <div className="group flex flex-col items-center text-center p-10 rounded-[32px] bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <IconDeviceDesktopAnalytics className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">통계 대시보드</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  어떤 링크가 가장 인기가 많은지, 상세한 클릭 통계를 한눈에 확인해 보세요.
                </p>
              </div>

              <div className="group flex flex-col items-center text-center p-10 rounded-[32px] bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <IconShare className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100">손쉬운 공유</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                  짧고 외우기 쉬운 나만의 고유 URL을 복사하여 모든 소셜 프로필에 등록하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 CTA 섹션 */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 py-24 px-6 border-t border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              지금 바로 시작하세요
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              신용카드 등록 없이, 평생 무료로 나만의 페이지를 운영하세요.
            </p>
            <div className="pt-4 flex justify-center">
              <Button onClick={handleLogin} className="h-14 px-10 text-md rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0" size="lg">
                <IconBrandGoogle className="w-5 h-5 mr-2" />
                1분 만에 페이지 만들기
              </Button>
            </div>
          </div>
        </div>
        
        <footer className="w-full py-8 bg-zinc-50 dark:bg-zinc-950 text-center text-sm text-zinc-400 dark:text-zinc-600 border-t border-zinc-200/50 dark:border-zinc-800/50">
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
