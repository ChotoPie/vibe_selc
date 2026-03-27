import React, { useState } from 'react';
import { Button } from './ui/button';

interface LinkAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, url: string) => void;
}

export function LinkAddDialog({ isOpen, onClose, onAdd }: LinkAddDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onAdd(title.trim(), url.trim());
      setTitle('');
      setUrl('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-[0_0_4rem_-1rem_rgba(168,85,247,0.3)] animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">새 링크 추가</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-300">타이틀</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 인스타그램"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="text-sm font-medium text-slate-300">URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 text-slate-300 hover:text-white hover:bg-white/10 bg-transparent">
              취소
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-lg shadow-purple-600/20">
              추가하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
