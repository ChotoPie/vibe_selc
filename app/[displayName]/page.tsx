import { Metadata } from "next";
import ProfileClientPage from "./page-client";

export async function generateMetadata({ params }: { params: Promise<{ displayName: string }> | { displayName: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const displayName = resolvedParams?.displayName || "";
  
  let username = displayName || "User";
  let bio = "단 하나의 링크로 당신의 모든 것을 보여주세요.";
  
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId) {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "users" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "displayName" },
                op: "EQUAL",
                value: { stringValue: displayName },
              },
            },
            limit: 1,
          },
        }),
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].document) {
          const fields = data[0].document.fields;
          if (fields.username?.stringValue) username = fields.username.stringValue;
          if (fields.bio?.stringValue) bio = fields.bio.stringValue;
        }
      }
    }
  } catch (error) {
    console.error("SEO Profile Fetch Error:", error);
  }

  const title = `${username}`;
  
  return {
    title,
    description: bio,
    openGraph: {
      title: `${username} | My-Link`,
      description: bio,
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} | My-Link`,
      description: bio,
    }
  };
}

export default function ProfilePage() {
  return <ProfileClientPage />;
}
