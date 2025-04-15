import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OneBot 大典",
  description: "沟槽的 OneBot 11 百科全书",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      { text: '总序', link: '/general/' },
      { text: '通信', link: '/general/network' },
      {
        text: 'API',
        link: '/api/',
        items: [
          { text: '分类标准', link: '/api/classify' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tanebijs/onebot-ency' }
    ]
  },
  base: "/onebot-ency/"
})
