"use client";

import { useState } from "react";
import { LinkItem } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
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

interface LinkCardProps {
  link: LinkItem;
  isOwner: boolean;
}

export function LinkCard({ link, isOwner }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: link.title, url: link.url },
  });

  const onUpdate = async (data: FormValues) => {
    let domain = "google.com";
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    try {
      domain = new URL(formattedUrl).hostname;
    } catch {}

    try {
      await updateDoc(doc(db, "users", "anonymous", "links", link.id), {
        title: data.title,
        url: formattedUrl,
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("링크 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "users", "anonymous", "links", link.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("링크 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="w-full p-5 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-[20px] shadow-sm">
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`title-${link.id}`} className={errors.title ? "text-red-500" : ""}>링크 이름</Label>
            <Input
              id={`title-${link.id}`}
              placeholder="예: 깃허브, 블로그"
              {...register("title")}
              className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`url-${link.id}`} className={errors.url ? "text-red-500" : ""}>URL 주소</Label>
            <Input
              id={`url-${link.id}`}
              placeholder="예: github.com/username"
              {...register("url")}
              className={errors.url ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.url && <p className="text-sm text-red-500 font-medium">{errors.url.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); reset(); }}>
              <IconX className="w-4 h-4 mr-1" />
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <IconCheck className="w-4 h-4 mr-1" />
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <>
      <div className="group relative w-full block">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="w-full outline-none block">
          <Card className="relative flex items-center p-4 h-[68px] transition-all duration-300 ease-out border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-[20px] focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300 cursor-pointer">
            <div className="absolute left-4 flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full group-hover:scale-105 transition-transform duration-300">
              <img src={link.icon} alt={`${link.title} icon`} className="w-5 h-5 object-contain" />
            </div>
            
            {/* Action buttons take up space on the right, so pad right accordingly */}
            <div className={`w-full flex justify-center px-14 ${isOwner ? 'pr-24' : ''}`}>
              <span className="font-semibold text-[15px] tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                {link.title}
              </span>
            </div>
          </Card>
        </a>
        
        {isOwner && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-full transition-colors"
              onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
            >
              <IconEdit className="w-4.5 h-4.5" stroke={1.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
              onClick={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
            >
              <IconTrash className="w-4.5 h-4.5" stroke={1.5} />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{link.title}</span>
              <br />
              <span className="text-red-500 font-bold block mt-3">이 작업은 되돌릴 수 없습니다.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
