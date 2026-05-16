# 마이링크 (My-Link) 프로젝트 가이드

이 파일은 `My-Link` 프로젝트의 구조, 기술 스택, 개발 규칙 및 주요 워크플로우를 정의합니다. Gemini CLI와 개발자는 이 가이드를 준수하여 일관성 있는 개발을 진행해야 합니다.

## 1. 프로젝트 개요
**마이링크(My-Link)**는 인스타그램, 틱톡, 깃허브 등 소셜 미디어 프로필에 단 하나만 허용되는 링크 섹션을 보완하기 위한 '멀티 링크 랜딩 페이지' 서비스입니다. 개발자와 크리에이터가 자신의 다양한 작업물과 채널을 한곳에 모아 공유할 수 있도록 돕습니다.

### 핵심 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend/Auth**: Firebase (Authentication, Firestore)
- **Icons**: @tabler/icons-react
- **Fonts**: Noto Sans, Geist Mono

## 2. 주요 기능 (구현 예정)
1. **회원 인증**: Firebase Auth를 이용한 구글 소셜 로그인만 지원.
2. **프로필 관리**:
   - `displayName`: URL 슬러그로 사용 (예: `mylink.com/username`). 지메일 아이디에서 초기값 추출.
   - `username`: 프로필에 표시될 실제 이름.
   - **인라인 편집**: 별도의 폼 페이지 없이 화면에서 직접 텍스트 클릭 후 수정 가능.
3. **링크 관리**:
   - 타이틀과 URL을 포함한 버튼형 링크 생성(CRUD).
   - **구글 파비콘 API**를 활용하여 링크 대상 사이트의 아이콘 자동 추출.
   - 인라인 편집 방식의 수정 지원.
4. **퍼블릭 프로필 페이지**: 사용자가 설정한 `displayName` 경로로 접속 가능한 반응형 웹 페이지.

## 3. 데이터베이스 구조 (Firestore)
- **Users (Collection)**: `users/{uid}`
  - `displayName`: string (unique, URL slug)
  - `username`: string (display name)
  - `bio`: string
  - **Links (Sub-collection)**: `users/{uid}/links/{linkId}`
    - `title`: string
    - `url`: string
    - `order`: number (정렬 순서)
    - `createdAt`: timestamp

## 4. 빌드 및 실행 명령어
- **개발 서버 실행**: `npm run dev`
- **프로젝트 빌드**: `npm run build`
- **프로덕션 실행**: `npm run start`
- **코드 포맷팅**: `npm run format` (Prettier)
- **린트 체크**: `npm run lint` (ESLint)
- **타입 체크**: `npm run typecheck` (tsc)

## 5. 개발 규칙 및 컨벤션
- **언어**: UI 텍스트 및 문서는 **한국어**를 우선적으로 사용합니다.
- **컴포넌트**: `shadcn/ui`를 적극 활용하며, 모든 UI 컴포넌트는 `components/ui` 폴더에 위치시킵니다.
- **스타일링**: Tailwind CSS 4의 유틸리티 클래스를 사용하며, 복잡한 조건부 클래스는 `lib/utils.ts`의 `cn` 함수를 사용합니다.
- **UI 구조**:
  - **단일 페이지 레이아웃**: `/displayName` 경로에서 프로필 조회와 편집이 모두 이루어집니다.
  - **인라인 편집**: 텍스트(username, bio, link title/url) 클릭 시 즉시 `Input` 요소로 전환되어 수정되는 방식을 구현합니다.
  - **자동 파비콘**: Google Favicon API를 통해 링크의 아이콘을 자동으로 표시합니다.
- **검증**: 모든 변경 사항은 `npm run build`를 통해 빌드 오류가 없는지 확인해야 합니다.
- **커밋 메시지**: 한글로 상세하게 작성하며, 변경된 기능의 이유와 내용을 포함합니다.

## 6. 프로젝트 구조
- `app/`: Next.js App Router 기반의 페이지 및 레이아웃.
- `components/`: 재사용 가능한 UI 컴포넌트. `ui/` 폴더에는 shadcn/ui 컴포넌트 포함.
- `docs/`: 프로젝트 요구사항(PRD), 사용자 시나리오 등 문서.
- `hooks/`: 커스텀 React Hooks.
- `lib/`: 유틸리티 함수 및 Firebase 설정 등.
- `public/`: 정적 자산.
