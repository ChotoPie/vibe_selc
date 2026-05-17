import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { useProfile, ProfileData } from "@/hooks/useProfile";

interface ProfileHeaderProps {
  uid: string;
  isOwner?: boolean;
}

export function ProfileHeader({ uid, isOwner = true }: ProfileHeaderProps) {
  const { profile, updateProfile, isLoading } = useProfile(uid);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({ displayName: "", username: "", bio: "" });

  // 캐시된 프로필 데이터가 들어오면 로컬 폼 상태 동기화
  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center space-y-4 mb-10 w-full px-4 animate-pulse">
        <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        <div className="h-16 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(formData, {
      onError: (error) => {
        alert(error.message);
      }
    });
    setIsEditing(false); // 에러가 나면 캐시 롤백에 의해 폼도 이전 값으로 돌아감
  };

  const handleCancel = () => {
    setFormData(profile); // 변경 사항 초기화
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (isOwner) setIsEditing(true);
  };

  if (isEditing && isOwner) {
    return (
      <div className="flex flex-col items-center w-full px-4 mb-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-full max-w-sm space-y-4 p-6 bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">표시 이름</label>
            <Input 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="이름을 입력하세요"
              className="font-medium bg-zinc-50 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">아이디 (@id)</label>
            <Input 
              value={formData.displayName} 
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              placeholder="고유 아이디를 입력하세요"
              className="font-medium bg-zinc-50 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">소개글</label>
            <Textarea 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="나를 소개하는 짧은 글을 작성해보세요"
              className="resize-none h-24 bg-zinc-50 dark:bg-zinc-950"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 rounded-[16px]" onClick={handleCancel}>
              <IconX className="w-4 h-4 mr-1" /> 취소
            </Button>
            <Button className="flex-1 rounded-[16px]" onClick={handleSave}>
              <IconCheck className="w-4 h-4 mr-1" /> 저장
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center space-y-3 mb-10 w-full px-4 relative ${isOwner ? 'group' : ''}`}>
      {isOwner && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleEditClick}
          className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <IconEdit className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </Button>
      )}

      <h1 
        className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors ${isOwner ? 'cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300' : ''}`} 
        onClick={handleEditClick}
        title={isOwner ? "클릭하여 수정하기" : ""}
      >
        {profile.username || "사용자"}
      </h1>
      
      <span 
        className={`text-zinc-600 dark:text-zinc-400 font-bold tracking-wide text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 px-3.5 py-1 rounded-full transition-colors ${isOwner ? 'cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}`} 
        onClick={handleEditClick}
        title={isOwner ? "클릭하여 아이디 수정하기" : ""}
      >
        @{profile.displayName || "id"}
      </span>

      <p 
        className={`text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-sm whitespace-pre-wrap leading-relaxed font-medium mt-2 transition-colors ${isOwner ? 'cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200' : ''}`} 
        onClick={handleEditClick}
        title={isOwner ? "클릭하여 소개글 수정하기" : ""}
      >
        {profile.bio || (isOwner ? "아직 소개글이 없습니다. 클릭하여 나를 소개해보세요!" : "아직 소개글이 없습니다.")}
      </p>
    </div>
  );
}
