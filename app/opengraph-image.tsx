import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'My-Link';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
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
          backgroundColor: '#09090b',
          backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, #09090b 50%, rgba(168, 85, 247, 0.2) 100%)',
          position: 'relative',
        }}
      >
        {/* 콘텐츠 중앙 정렬 영역 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* 로고 영역 (아이콘 대체 모양) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: '#fff',
              borderRadius: '24px',
              marginBottom: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            {/* Link 아이콘을 단순 도형으로 구현 */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#09090b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.05em',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            My-Link
          </h1>
          
          <p
            style={{
              fontSize: '36px',
              fontWeight: 500,
              color: '#a1a1aa', // zinc-400
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            당신의 모든 것을 하나의 링크로
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
