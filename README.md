# 마이링크 (My-Link)

**마이링크(My-Link)**는 인스타그램, 틱톡, 깃허브 등 소셜 미디어 프로필에 단 하나만 허용되는 링크 섹션을 보완하기 위한 '멀티 링크 랜딩 페이지' 서비스입니다. 개발자와 크리에이터가 자신의 다양한 작업물과 채널을 한곳에 모아 직관적이고 아름답게 공유할 수 있도록 돕습니다.

## ✨ 주요 기능

- **간편한 소셜 로그인**: 이메일 가입 없이 Firebase Auth를 이용한 구글 로그인으로 빠르게 시작할 수 있습니다.
- **직관적인 인라인 편집**: 별도의 설정 페이지로 이동할 필요 없이, 프로필 화면에서 텍스트(이름, 소개글, 링크)를 클릭하여 즉시 수정할 수 있습니다.
- **자동 파비콘 추출**: 링크를 추가하면 Google Favicon API를 활용하여 대상 사이트의 아이콘을 자동으로 가져와 버튼에 예쁘게 표시합니다.
- **나만의 맞춤형 고유 URL**: 가입 시 지메일 아이디를 기반으로 초기 URL 슬러그(`displayName`)가 부여되며, 이를 통해 누구나 접속 가능한 나만의 프로필 페이지를 가질 수 있습니다.
- **반응형 디자인**: 모바일 기기는 물론 데스크탑 환경에서도 최적화된 모던한 UI를 제공합니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend / Auth**: Firebase (Authentication, Firestore)
- **Icons**: @tabler/icons-react
- **Fonts**: Noto Sans KR, Geist Mono

## 🚀 로컬 개발 환경 설정

프로젝트를 로컬 환경에서 실행하기 위한 단계입니다.

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
루트 디렉토리에 `.env.local` 파일을 생성하고 Firebase 프로젝트 정보를 입력합니다.
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

## 📚 주요 스크립트

- `npm run dev`: 개발 모드로 서버를 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run start`: 빌드된 프로덕션 서버를 실행합니다.
- `npm run format`: Prettier를 사용하여 코드를 포맷팅합니다.
- `npm run lint`: ESLint를 통해 코드 컨벤션을 검사합니다.
- `npm run typecheck`: TypeScript 타입 검사를 수행합니다.

## 📄 라이선스
이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.
