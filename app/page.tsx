"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // 임시: 접속 시 랜딩 페이지를 거치지 않고 바로 익명(기본) 프로필 구경 페이지로 이동
    router.push("/anonymous");
  }, [router]);

  return <div className="flex min-h-screen items-center justify-center">이동 중...</div>;
}
