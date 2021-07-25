module.exports = {
  base: '/drag-layout/',
  title: 'DragLayout',
  themeConfig: {
    sidebar: "auto",
    smoothScroll: true,
    repo: 'https://github.com/xiaosu95/drag-layout',
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
