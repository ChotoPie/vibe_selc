"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLinks } from "@/hooks/useLinks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IconChartBar, IconMouse, IconArrowLeft } from "@tabler/icons-react"

export default function StatsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/");
    }
  }, [user, isAuthLoading, router]);

  const { links, isLoading: isLinksLoading } = useLinks(user?.uid);

  if (isAuthLoading || (user && isLinksLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!user) return null; // will redirect

  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Prepare chart data (sort by clicks descending)
  const chartData = links.map(link => ({
    title: link.title,
    clicks: link.clicks || 0,
  })).sort((a, b) => b.clicks - a.clicks); // Sort by most clicked

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen relative bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 overflow-hidden selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* Background Glow Effects (랜딩 페이지와 일관성 유지) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              통계 대시보드
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base">
              생성하신 링크들의 성과와 클릭수를 한눈에 확인하세요.
            </p>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            대시보드로 돌아가기
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Total Clicks Card - Hero (Gradient) */}
          <Card className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden relative">
            {/* Subtle card glow/pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">총 클릭수</CardTitle>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <IconMouse className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-blue-100/80 mt-2 font-medium">
                모든 링크의 클릭 합산
              </p>
            </CardContent>
          </Card>
          
          {/* Active Links Card */}
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">활성 링크 수</CardTitle>
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <IconChartBar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{links.length}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                현재 등록된 링크
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-900 dark:text-zinc-100">링크별 클릭 성과</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              어떤 링크가 가장 인기가 많은지 비교해 보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[350px] w-full mt-6">
                <BarChart accessibilityLayer data={chartData}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} /> {/* blue-500 */}
                      <stop offset="100%" stopColor="#9333ea" stopOpacity={1} /> {/* purple-600 */}
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-zinc-200 dark:stroke-zinc-800" opacity={0.5} />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    tickMargin={12}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                    className="text-xs font-medium fill-zinc-500 dark:fill-zinc-400"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    className="text-xs font-medium fill-zinc-500 dark:fill-zinc-400"
                  />
                  <ChartTooltip 
                    cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }} 
                    content={<ChartTooltipContent hideLabel className="shadow-lg border-zinc-200 dark:border-zinc-800 rounded-xl" />} 
                  />
                  <Bar dataKey="clicks" fill="url(#colorClicks)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] text-zinc-400 dark:text-zinc-600 space-y-3">
                <IconChartBar className="w-12 h-12 opacity-50" />
                <p className="text-sm font-medium">아직 등록된 링크가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
