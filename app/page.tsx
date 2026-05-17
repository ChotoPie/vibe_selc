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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            router.push(`/${userDoc.data().displayName}`);
          } else {
            const emailPrefix = user.email ? user.email.split('@')[0] : user.uid;
            router.push(`/${emailPrefix}`);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { displayName } = await signInWithGoogle();
      router.push(`/${displayName}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-foreground font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          My-Link
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          단 하나의 링크로 당신의 모든 것을 보여주세요.
        </p>
        <Button onClick={handleLogin} className="w-full h-14 text-md rounded-full mt-8 shadow-md" size="lg">
          Google 계정으로 시작하기
        </Button>
      </div>
    </div>
  );
}
