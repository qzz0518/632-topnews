import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/632-topnews/' : '/',
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/sina': {
        target: 'https://feed.mix.sina.com.cn',
        changeOrigin: true,
        rewrite: () => '/api/roll/get?pageid=153&lid=2509&k=&num=20&page=1',
      },
      '/api/nhk': {
        target: 'https://www3.nhk.or.jp',
        changeOrigin: true,
        rewrite: () => '/rss/news/cat0.xml',
      },
      '/api/nyt': {
        target: 'https://rss.nytimes.com',
        changeOrigin: true,
        rewrite: () => '/services/xml/rss/nyt/World.xml',
      },
      '/api/bbc': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: () => '/news/world/rss.xml',
      },
    },
  },
}));
