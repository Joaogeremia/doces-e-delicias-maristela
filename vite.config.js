import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-site-polish-css',
      transformIndexHtml(html) {
        return html.replace('</head>', '    <link rel="stylesheet" href="/admin-fix.css">\n    <link rel="stylesheet" href="/polish.css">\n  </head>');
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
