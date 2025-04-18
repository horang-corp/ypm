import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "favicon.svg" }]],
  title: "ypm",
  description: "약속 프로그래밍 언어를 위한 패키지 매니저",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "favicon.svg",

    sidebar: [
      {
        text: "가이드",
        items: [
          { text: "1. ypm이 무엇인가요?", link: "/guide/what-is-ypm" },
          { text: "2. 빠르게 시작하기", link: "/guide/quick-start" },
          { text: "3. 약속 프로젝트 생성하기", link: "/guide/init" },
          { text: "4. 의존성 관리하기", link: "/guide/managing-dependencies" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/horang-corp/ypm" },
    ],
    search: {
      provider: "local",
    },
    footer: {
      copyright:
        'Copyright ⓒ 2025 <a href="https://horang.it" target="_blank">Horang</a>. All Rights Reserved',
    },
  },
});
