import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 font-sans transition-colors duration-500">
      <main className="flex flex-col items-center gap-8 text-center">
        {/* Profile Image / Avatar Placeholder */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ring-4 ring-zinc-50 dark:ring-zinc-900 shadow-xl">
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-400">
            변
          </div>
        </div>

        {/* Name and Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            변정민
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Software Engineer & Designer
          </p>
        </div>

        {/* Links / Socials Placeholder */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href="#"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-foreground px-6 font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            GitHub
          </a>
          <a
            href="#"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 font-medium text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 font-medium text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            Portfolio
          </a>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-zinc-500">
        © {new Date().getFullYear()} 변정민. All rights reserved.
      </footer>
    </div>
  );
}
