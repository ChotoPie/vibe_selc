"use client";

import { useState } from "react";
import { dummyLinks, LinkItem } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconShare, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  // 프로필 더미 데이터 (PRD 기준: 프로필 이미지 없음, username과 bio 노출)
  const profile = {
    username: "개발자 홍길동",
    bio: "프론트엔드 개발자입니다.\n좋은 사용자 경험(UX)을 만드는 데 관심이 많습니다.",
  };

  const [links, setLinks] = useState<LinkItem[]>(dummyLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");
    if (!newLinkTitle || !newLinkUrl) return;

    let domain = "google.com";
    let formattedUrl = newLinkUrl;
    
    try {
      formattedUrl = newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`;
      const url = new URL(formattedUrl);
      domain = url.hostname;
      
      // Basic validation: domain should contain a dot
      if (!domain.includes('.')) {
        setUrlError("올바른 URL 형식을 입력해주세요. (예: github.com)");
        return;
      }
    } catch (error) {
      setUrlError("올바른 URL 형식을 입력해주세요.");
      return;
    }

    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      title: newLinkTitle,
      url: formattedUrl,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    };

    setLinks([...links, newLink]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans">
      
      {/* 상단 액션 바 (공유 버튼 등) */}
      <div className="w-full max-w-xl flex justify-end mb-8 mt-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <IconShare stroke={1.5} className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        {/* 프로필 헤더 영역 */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10 w-full px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {profile.username}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-sm whitespace-pre-wrap leading-relaxed font-medium">
            {profile.bio}
          </p>
        </div>

        {/* 링크 목록 영역 */}
        <div className="w-full flex flex-col gap-3">
          {/* 링크 추가 버튼 및 다이얼로그 */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setNewLinkTitle("");
              setNewLinkUrl("");
              setUrlError("");
            }
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
              <form onSubmit={handleAddLink} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">링크 이름</Label>
                  <Input
                    id="title"
                    placeholder="예: 깃허브, 블로그"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className={urlError ? "text-red-500" : ""}>URL 주소</Label>
                  <Input
                    id="url"
                    placeholder="예: github.com/username"
                    value={newLinkUrl}
                    onChange={(e) => {
                      setNewLinkUrl(e.target.value);
                      if (urlError) setUrlError("");
                    }}
                    className={urlError ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {urlError && <p className="text-sm text-red-500 font-medium">{urlError}</p>}
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={!newLinkTitle || !newLinkUrl}>추가하기</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full outline-none block"
            >
              <Card className="relative flex items-center p-4 h-[68px] transition-all duration-300 ease-out border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-[20px] group-focus-visible:ring-2 group-focus-visible:ring-zinc-900 dark:group-focus-visible:ring-zinc-300 cursor-pointer">
                
                {/* 파비콘 아이콘 영역 */}
                <div className="absolute left-4 flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={link.icon}
                    alt={`${link.title} icon`}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                
                {/* 링크 타이틀 */}
                <div className="w-full flex justify-center px-14">
                  <span className="font-semibold text-[15px] tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                    {link.title}
                  </span>
                </div>
                
              </Card>
            </a>
          ))}
        </div>

        {/* 하단 푸터 (My-Link 브랜딩) */}
        <div className="mt-16 mb-8 text-zinc-400 dark:text-zinc-600 font-medium text-xs tracking-wider flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          Made with <span className="text-zinc-800 dark:text-zinc-200 font-bold tracking-tight">My-Link</span>
        </div>
      </div>
    </div>
  );
}
