"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLinks } from "@/hooks/useLinks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IconChartBar, IconMouse } from "@tabler/icons-react"

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
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
    fill: "var(--color-clicks)"
  })).sort((a, b) => b.clicks - a.clicks); // Sort by most clicked

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">통계 대시보드</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              생성하신 링크들의 성과와 클릭수를 한눈에 확인하세요.
            </p>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
            ← 홈으로 돌아가기
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-300">총 클릭수</CardTitle>
              <IconMouse className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                모든 링크의 클릭 합산
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-300">활성 링크 수</CardTitle>
              <IconChartBar className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{links.length}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                현재 등록된 링크
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">링크별 클릭 성과</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              어떤 링크가 가장 인기가 많은지 비교해 보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[350px] w-full mt-4">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                    className="text-xs fill-zinc-500 dark:fill-zinc-400"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    className="text-xs fill-zinc-500 dark:fill-zinc-400"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-sm text-zinc-500 dark:text-zinc-400">
                아직 등록된 링크가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
