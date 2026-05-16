export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export const dummyLinks: LinkItem[] = [
  {
    id: "1",
    title: "Instagram",
    url: "https://www.instagram.com",
    icon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=128",
  },
  {
    id: "2",
    title: "YouTube",
    url: "https://www.youtube.com",
    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
  },
  {
    id: "3",
    title: "Blog",
    url: "https://velog.io",
    icon: "https://www.google.com/s2/favicons?domain=velog.io&sz=128",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
  },
  {
    id: "5",
    title: "Portfolio",
    url: "https://www.notion.so",
    icon: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
  },
];
