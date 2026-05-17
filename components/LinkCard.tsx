import { useState } from "react";
import { LinkItem } from "@/data/links";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTrash, IconEdit, IconCheck, IconX, IconAlertCircle, IconChartBar } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLinks } from "@/hooks/useLinks";

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

interface LinkCardProps {
  link: LinkItem;
  isOwner: boolean;
  profileUid: string;
}

export function LinkCard({ link, isOwner, profileUid }: LinkCardProps) {
  const { updateLink, deleteLink, incrementClick } = useLinks(profileUid);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: link.title, url: link.url },
  });

  const onSubmit = (data: FormValues) => {
    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try { domain = new URL(formattedUrl).hostname; } catch {}

    updateLink({ id: link.id, title: data.title, url: formattedUrl, domain });
    setIsEditing(false); // 낙관적 업데이트로 로딩을 기다릴 필요 없이 즉시 수정 폼 닫기
  };

  const handleDelete = () => {
    deleteLink(link.id);
    setIsDeleteDialogOpen(false); // 낙관적 업데이트로 모달 즉시 닫기
  };

  if (isEditing) {
    return (
      <Card className="p-4 w-full border-2 border-zinc-900 dark:border-zinc-100 shadow-sm rounded-[20px] bg-white dark:bg-zinc-900 animate-in fade-in duration-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500">링크 이름</label>
            <Input 
              {...register("title")} 
              className={errors.title ? "border-red-500 focus-visible:ring-red-500 bg-zinc-50 dark:bg-zinc-950" : "bg-zinc-50 dark:bg-zinc-950"} 
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500">URL 주소</label>
            <Input 
              {...register("url")} 
              className={errors.url ? "border-red-500 focus-visible:ring-red-500 bg-zinc-50 dark:bg-zinc-950" : "bg-zinc-50 dark:bg-zinc-950"} 
            />
            {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" type="button" className="flex-1 rounded-[16px]" onClick={() => { setIsEditing(false); reset(); }}>
              <IconX className="w-4 h-4 mr-1" /> 취소
            </Button>
            <Button type="submit" className="flex-1 rounded-[16px]">
              <IconCheck className="w-4 h-4 mr-1" /> 저장
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  const handleLinkClick = () => {
    incrementClick(link.id);
  };

  return (
    <>
      <div className="group w-full relative block">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-none block w-full"
          onClick={handleLinkClick}
        >
          <Card className="relative flex items-center p-4 h-[68px] transition-all duration-300 ease-out border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-[20px] focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300 cursor-pointer">
            <div className="absolute left-4 flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full group-hover:scale-105 transition-transform duration-300">
              <img src={link.icon} alt={`${link.title} icon`} className="w-5 h-5 object-contain" />
            </div>
            
            <div className="w-full flex justify-center px-14">
              <span className="font-semibold text-[15px] tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                {link.title}
              </span>
            </div>

            {/* 클릭수 표시 (본인일 경우 호버 시 숨겨서 수정/삭제 버튼과 안 겹치게 함) */}
            <div className={`absolute right-4 flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-xs font-semibold transition-opacity duration-200 ${isOwner ? 'group-hover:opacity-0' : ''}`}>
              <IconChartBar stroke={2} className="w-3.5 h-3.5" />
              <span>{link.clicks || 0}</span>
            </div>
          </Card>
        </a>

        {isOwner && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
            >
              <IconEdit stroke={1.5} className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
            >
              <IconTrash stroke={1.5} className="w-4 h-4 text-red-500 dark:text-red-400" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <IconAlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <DialogTitle className="text-xl">정말 삭제하시겠습니까?</DialogTitle>
            </div>
            <DialogDescription className="text-base mt-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">"{link.title}"</span> 링크가 영구적으로 삭제됩니다.
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0 mt-6">
            <Button variant="outline" className="flex-1 rounded-[16px]" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" className="flex-1 rounded-[16px]" onClick={handleDelete}>
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
