import { Github, Linkedin, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 p-6 font-sans transition-colors duration-500">
      {/* Background Animated Gradients / Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob dark:bg-purple-900"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 dark:bg-yellow-900"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 dark:bg-pink-900"></div>

      <main className="z-10 flex w-full max-w-md flex-col items-center gap-8 animate-fade-in-up">
        {/* Profile Card */}
        <div className="glass-card flex w-full flex-col items-center rounded-3xl p-10 text-center transition-all duration-300 hover:shadow-2xl">
          {/* Avatar Area with Glow */}
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-zinc-900 ring-4 ring-white/50 dark:ring-zinc-800/50 shadow-2xl">
              <span className="text-5xl font-black bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                BJ
              </span>
            </div>
          </div>

          {/* Name and Title */}
          <div className="space-y-3 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 sm:text-5xl">
              변정민
            </h1>
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              Software Engineer & Designer
            </p>
          </div>

          {/* Action Links */}
          <div className="flex w-full flex-col gap-4">
            <a
              href="#"
              className="group flex h-14 w-full items-center justify-between rounded-2xl bg-white/60 dark:bg-zinc-800/50 px-6 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4 text-zinc-800 dark:text-zinc-100">
                <Github size={24} className="group-hover:text-purple-500 transition-colors" />
                <span className="font-semibold text-lg">GitHub</span>
              </div>
              <span className="text-zinc-400 group-hover:text-purple-500 transition-colors">→</span>
            </a>

            <a
              href="#"
              className="group flex h-14 w-full items-center justify-between rounded-2xl bg-white/60 dark:bg-zinc-800/50 px-6 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4 text-zinc-800 dark:text-zinc-100">
                <Linkedin size={24} className="group-hover:text-blue-500 transition-colors" />
                <span className="font-semibold text-lg">LinkedIn</span>
              </div>
              <span className="text-zinc-400 group-hover:text-blue-500 transition-colors">→</span>
            </a>

            <a
              href="#"
              className="group flex h-14 w-full items-center justify-between rounded-2xl bg-white/60 dark:bg-zinc-800/50 px-6 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4 text-zinc-800 dark:text-zinc-100">
                <Briefcase size={24} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-semibold text-lg">Portfolio</span>
              </div>
              <span className="text-zinc-400 group-hover:text-emerald-500 transition-colors">→</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="z-10 absolute bottom-6 text-sm font-medium text-zinc-500 dark:text-zinc-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        © {new Date().getFullYear()} 변정민. Crafted with care.
      </footer>
    </div>
  );
}
