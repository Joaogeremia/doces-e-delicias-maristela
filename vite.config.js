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
    {
      name: 'admin-category-select',
      transform(code, id) {
        if (!id.endsWith('/src/main.jsx')) return null;
        const oldField = '<label>Categoria<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label>';
        const newField = '<label>Categoria<select required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="Bolos">Bolos</option><option value="Doces">Doces</option><option value="Kits Festa">Kits Festa</option><option value="Sobremesas">Sobremesas</option><option value="Kits e Cestas">Kits e Cestas</option></select></label>';
        return { code: code.replace(oldField, newField), map: null };
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
