import { Github, Linkedin, Mail, ArrowRight, MonitorSmartphone, Paintbrush, Braces } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neo-bg text-black selection:bg-neo-pink selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b-4 border-black bg-neo-bg">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-3xl font-black tracking-tighter">BJ.</div>
          <div className="hidden md:flex gap-8 font-bold text-lg">
            <a href="#about" className="hover:underline decoration-4 underline-offset-4">About</a>
            <a href="#projects" className="hover:underline decoration-4 underline-offset-4">Projects</a>
            <a href="#contact" className="hover:underline decoration-4 underline-offset-4">Contact</a>
          </div>
          <a href="#contact" className="neo-button bg-neo-yellow px-6 py-2 font-bold text-lg hidden sm:block">
            Resume
          </a>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-start border-b-4 border-black">
          <div className="inline-block bg-neo-green neo-border px-4 py-1 font-bold text-sm mb-6 -rotate-2">
            AVAILABLE FOR WORK
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[1] mb-6">
            Software<br />
            <span className="text-neo-blue" style={{ textShadow: '4px 4px 0px #000' }}>Engineer</span><br />
            변정민
          </h1>
          <p className="text-xl md:text-2xl font-semibold max-w-2xl mb-10 border-l-[6px] border-black pl-4">
            직관적이고 과감한 디자인, 견고하고 확장성 있는 코드로 몰입감 넘치는 디지털 경험을 구축합니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="neo-button bg-neo-pink px-8 py-4 font-black text-xl flex items-center gap-2">
              View Work <ArrowRight strokeWidth={3} />
            </a>
            <a href="#contact" className="neo-button bg-white px-8 py-4 font-black text-xl flex items-center gap-2">
              Contact Me
            </a>
          </div>
        </section>

        {/* Skills / About Section */}
        <section id="about" className="bg-neo-blue py-24 border-b-4 border-black">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-12 flex items-center gap-4">
              <span className="bg-white neo-border px-4 py-2">My</span> Arsenal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Skill Card 1 */}
              <div className="neo-card p-8 bg-neo-yellow hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-white neo-border w-14 h-14 flex items-center justify-center mb-6">
                  <MonitorSmartphone size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black mb-4">Frontend</h3>
                <p className="font-bold text-lg mb-6">React, Next.js, TypeScript와 Tailwind CSS를 활용합니다.</p>
                <div className="flex gap-2 flex-wrap font-bold text-sm">
                  <span className="bg-white px-3 py-1 neo-border">React 19</span>
                  <span className="bg-white px-3 py-1 neo-border">Next 15</span>
                </div>
              </div>

              {/* Skill Card 2 */}
              <div className="neo-card p-8 bg-white hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-neo-pink neo-border w-14 h-14 flex items-center justify-center mb-6">
                  <Paintbrush size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black mb-4">UI/UX Design</h3>
                <p className="font-bold text-lg mb-6">Figma를 기반으로 한 독창적이고 사용자 친화적인 와이어프레임 및 디자인.</p>
                <div className="flex gap-2 flex-wrap font-bold text-sm">
                  <span className="bg-neo-pink px-3 py-1 neo-border">Figma</span>
                  <span className="bg-neo-pink px-3 py-1 neo-border">Neobrutalism</span>
                </div>
              </div>

              {/* Skill Card 3 */}
              <div className="neo-card p-8 bg-neo-green hover:-translate-y-2 transition-transform duration-300 md:col-span-2 lg:col-span-1">
                <div className="bg-white neo-border w-14 h-14 flex items-center justify-center mb-6">
                  <Braces size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black mb-4">Architecture</h3>
                <p className="font-bold text-lg mb-6">확장성을 고려한 클린 코드와 상태 관리, 효율적인 API 설계 통신.</p>
                <div className="flex gap-2 flex-wrap font-bold text-sm">
                  <span className="bg-white px-3 py-1 neo-border">REST API</span>
                  <span className="bg-white px-3 py-1 neo-border">State</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 max-w-6xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-12">Featured Work</h2>

          <div className="flex flex-col gap-12">
            {/* Project 1 */}
            <div className="neo-card bg-neo-pink flex flex-col md:flex-row overflow-hidden group">
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-black bg-white">
                <h3 className="text-4xl font-black mb-4">E-Commerce Redesign</h3>
                <p className="text-lg font-bold mb-6">강렬한 네오브루탈리즘 원칙과 Next.js로 구축된 전환율 높은 프론트엔드 아키텍처.</p>
                <button className="neo-button bg-neo-yellow px-6 py-3 font-bold w-fit flex items-center gap-2 cursor-pointer">
                  View Case Study <ArrowRight size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="w-full md:w-1/2 bg-neo-yellow p-8 flex items-center justify-center relative overflow-hidden">
                <div className="w-full aspect-video bg-white neo-border flex items-center justify-center shadow-[4px_4px_0px_#000] rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  <span className="font-black text-2xl text-neo-pink text-center px-4">IMG PLACEHOLDER</span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="neo-card bg-neo-blue flex flex-col md:flex-row-reverse overflow-hidden group">
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-b-4 md:border-b-0 md:border-l-4 border-black bg-white">
                <h3 className="text-4xl font-black mb-4">SaaS Dashboard</h3>
                <p className="text-lg font-bold mb-6">실시간 데이터 시각화와 다크모드 기반 브루탈리스트 테마를 갖춘 분석 플랫폼.</p>
                <button className="neo-button bg-neo-green px-6 py-3 font-bold w-fit flex items-center gap-2 cursor-pointer">
                  View Demo <ArrowRight size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="w-full md:w-1/2 bg-neo-blue p-8 flex items-center justify-center relative overflow-hidden">
                <div className="w-full aspect-video bg-neo-bg neo-border flex items-center justify-center shadow-[4px_4px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  <span className="font-black text-2xl text-neo-blue text-center px-4">IMG PLACEHOLDER</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contact" className="bg-neo-yellow py-32 border-t-4 border-black border-b-4">
          <div className="max-w-4xl mx-auto px-6 text-center text-black">
            <h2 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-none">Let's Build Something Crazy!</h2>
            <p className="text-2xl font-bold mb-12">새로운 프로젝트 아이디어가 있으신가요? 함께 이야기해봐요.</p>
            <a href="mailto:hello@example.com" className="neo-button bg-black text-white hover:text-neo-yellow px-10 py-5 font-black text-2xl inline-block">
              HELLO@EXAMPLE.COM
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-black py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-4xl font-black tracking-tighter">BJ.</div>
          <p className="font-bold text-lg">© {new Date().getFullYear()} Byun Jungmin. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="neo-button bg-neo-pink p-3">
              <Github size={24} strokeWidth={2.5} />
            </a>
            <a href="#" className="neo-button bg-neo-blue p-3">
              <Linkedin size={24} strokeWidth={2.5} />
            </a>
            <a href="#" className="neo-button bg-neo-green p-3">
              <Mail size={24} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
