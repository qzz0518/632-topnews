import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/632-topnews/' : '/',
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/toutiao': {
        target: 'https://whyta.cn',
        changeOrigin: true,
        rewrite: () => '/api/toutiao?key=36de5db81215',
      },
      '/api/nhk': {
        target: 'https://www3.nhk.or.jp',
        changeOrigin: true,
        rewrite: () => '/rss/news/cat0.xml',
      },
      '/api/bbc': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: () => '/news/world/rss.xml',
      },
      '/api/cnn': {
        target: 'https://rss.cnn.com',
        changeOrigin: true,
        rewrite: () => '/rss/edition_world.rss',
      },
    },
  },
}));
