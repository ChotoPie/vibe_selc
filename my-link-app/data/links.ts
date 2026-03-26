/**
 * PRD 4항 (데이터베이스 모델링) 반영:
 * - 링크 데이터는 배열이 아닌 '사용자 문서(User)' 하위의 서브 컬렉션(Sub-collection)으로 관리됩니다.
 * - 이 파일은 프론트엔드 UI 테스트를 위해 해당 서브 컬렉션과 상위 사용자 문서를 모사한 더미 데이터입니다.
 */

export interface UserDocument {
  displayName: string; // URL 슬러그 식별자 (필수)
  username: string;    // 실제 보여지는 이름
  bio: string;         // 짧은 소개글
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string; // PRD 규칙 적용: "https://s2.googleusercontent.com/s2/favicons?domain={url}"
}

// 1. 상위 문서: 사용자(User) 더미 데이터
export const dummyUser: UserDocument = {
  displayName: "chotopie",
  username: "초코파이",
  bio: "안녕하세요! 마이링크 더미 프로필입니다."
};

// 2. 하위 문서: 링크 서브 컬렉션(Sub-collection) 더미 데이터
export const dummyLinks: LinkItem[] = [
  {
    id: "link_instagram",
    title: "인스타그램",
    url: "https://www.instagram.com/chotopie",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=https://www.instagram.com/chotopie"
  },
  {
    id: "link_youtube",
    title: "유튜브",
    url: "https://www.youtube.com/@chotopie",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=https://www.youtube.com/@chotopie"
  },
  {
    id: "link_blog",
    title: "블로그",
    url: "https://blog.naver.com/chotopie",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=https://blog.naver.com/chotopie"
  },
  {
    id: "link_github",
    title: "Github",
    url: "https://github.com/chotopie",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=https://github.com/chotopie"
  },
  {
    id: "link_portfolio",
    title: "포트폴리오",
    url: "https://portfolio.notion.site",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=https://portfolio.notion.site"
  }
];
