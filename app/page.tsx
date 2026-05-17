import { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  // layout.tsx의 default title이 사용됩니다.
  description: "단 하나의 멀티 링크 서비스, My-Link에서 나만의 페이지를 평생 무료로 만들어보세요.",
  openGraph: {
    title: "My-Link | 당신의 모든 것을 하나의 링크로",
    description: "인스타그램, 틱톡, 깃허브, 블로그까지. 나만의 채널들을 1분 만에 깔끔하게 모아보세요.",
  },
};

export default function Page() {
  return <PageClient />;
}
