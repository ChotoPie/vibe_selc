import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'My-Link Profile';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ displayName: string }> | { displayName: string } }) {
  // Next.js 버전에 따라 params가 Promise일 수 있으므로 await 처리
  const resolvedParams = await params;
  const displayName = resolvedParams?.displayName || "";
  
  let username = displayName || "User";
  let bio = "단 하나의 링크로 당신의 모든 것을 보여주세요.";
  
  // Edge 런타임 호환성을 위해 Firestore REST API 사용
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId) {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
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
        // 캐싱 비활성화 (동적 데이터 반영)
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].document) {
          const fields = data[0].document.fields;
          if (fields.username?.stringValue) {
            username = fields.username.stringValue;
          }
          if (fields.bio?.stringValue) {
            bio = fields.bio.stringValue;
          }
        }
      }
    }
  } catch (error) {
    console.error("OG Image 데이터 패치 오류:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b', // zinc-950
          backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, #09090b 40%, #09090b 60%, rgba(168, 85, 247, 0.3) 100%)',
          position: 'relative',
        }}
      >
        {/* 중앙 투명 명함(Glassmorphism) 카드 스타일 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '40px',
            padding: '80px',
            width: '800px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* 아바타 (첫 글자) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              backgroundColor: '#fff',
              borderRadius: '60px',
              marginBottom: '32px',
              fontSize: '60px',
              fontWeight: 800,
              color: '#09090b',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>

          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              textAlign: 'center',
              display: 'flex',
            }}
          >
            {username}
          </h1>
          
          <p
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#d4d4d8', // zinc-300
              lineHeight: 1.5,
              textAlign: 'center',
              display: 'flex',
              maxWidth: '600px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {bio}
          </p>

          <div 
            style={{
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              color: '#a1a1aa',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '12px' }}
            >
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
            </svg>
            My-Link
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
