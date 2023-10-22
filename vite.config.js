import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react()],
    base: '/age-guesser/',
    server: {
      // port: 1337,
      proxy: {
        '/api': {
          target: 'https://api.codetabs.com/v1/proxy?quest=',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};
