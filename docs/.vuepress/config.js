module.exports = {
  title: 'DragLayout',
  themeConfig: {
    sidebar: "auto",
    smoothScroll: true,
    repo: 'https://xiaosu95.coding.net/p/page-drag-layout/d/page-drag-layout/git',
    nav: [
      { text: '使用指南', link: '/guide.html' },
      { text: 'API', link: '/api.html' },
      { text: 'React接入', link: '/react.html' },
      { text: 'Vue接入', link: '/vue.html' },
    ]
  },
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/back-to-top']
};
