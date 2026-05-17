import { Metadata } from "next";
import StatsClientPage from "./page-client";

export const metadata: Metadata = {
  title: "통계 대시보드",
  description: "생성하신 링크들의 성과와 클릭수를 한눈에 확인하세요.",
  openGraph: {
    title: "통계 대시보드 | My-Link",
    description: "생성하신 링크들의 성과와 클릭수를 한눈에 확인하세요.",
  },
};

export default function StatsPage() {
  return <StatsClientPage />;
}
