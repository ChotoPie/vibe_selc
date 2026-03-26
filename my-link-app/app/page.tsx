import { dummyLinks, dummyUser } from '../data/links';
import { Card, CardContent } from "@/components/ui/card";

export default function LinksPage() {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#030014] text-slate-200 p-6 sm:p-12 font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Dynamic Avatar */}
        <div className="relative mt-8 mb-6 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 border border-gray-700 text-white flex items-center justify-center text-5xl font-extrabold shadow-2xl transform transition-transform duration-500 group-hover:scale-105 cursor-default">
            <span className="bg-gradient-to-br from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {dummyUser.username.charAt(0)}
            </span>
          </div>
        </div>
        
        {/* Profile Info */}
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          {dummyUser.username}
        </h1>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <p className="text-sm font-semibold text-purple-300 tracking-wide">@{dummyUser.displayName}</p>
        </div>
        
        <p className="text-base text-center text-slate-400 mb-12 max-w-sm leading-relaxed px-4 font-light">
          {dummyUser.bio}
        </p>

        {/* Links List */}
        <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          {dummyLinks.map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group outline-none"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Force transparent background over shadcn card default */}
              <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl shadow-lg transition-all duration-500 overflow-hidden group-hover:bg-white/[0.08] group-hover:border-purple-500/50 group-hover:shadow-[0_0_2rem_-0.5rem_rgba(168,85,247,0.4)] group-hover:-translate-y-1 rounded-2xl">
                <CardContent className="p-4 sm:p-5 flex items-center gap-5 relative">
                  
                  {/* Icon Container */}
                  <div className="w-14 h-14 flex-shrink-0 bg-black/40 rounded-xl p-3 flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-colors duration-500 shadow-inner">
                    <img
                      src={link.icon}
                      alt={`${link.title} icon`}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Title */}
                  <span className="font-semibold text-slate-200 text-lg tracking-wide group-hover:text-white transition-colors duration-300">
                    {link.title}
                  </span>

                  {/* Right Action Arrow */}
                  <div className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-purple-400/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-20 pb-10 text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-purple-400 transition-colors cursor-default">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          Powered by My-Link
        </div>

      </div>
    </div>
  );
}
