import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-admin-fix-css',
      transformIndexHtml(html) {
        return html.replace('</head>', '    <link rel="stylesheet" href="/admin-fix.css">\n  </head>');
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
