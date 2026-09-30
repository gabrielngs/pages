import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proteção de scripts. O GitHub Pages não aceita cabeçalhos de segurança,
// então ela vai numa <meta> no index.html. Na Vercel/Netlify, vercel.json e
// public/_headers completam o resto.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ')

// Só entra na versão publicada (npm run build). No modo de desenvolvimento
// (npm run dev), o Vite injeta o CSS e o recarregamento direto na página,
// e essa proteção bloquearia os dois.
function cspOnBuild() {
  return {
    name: 'csp-on-build',
    apply: 'build',
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }]
    },
  }
}

export default defineConfig({
  plugins: [react(), cspOnBuild()],
  // Caminhos relativos: o site funciona tanto na raiz de um domínio (Vercel/Netlify)
  // quanto dentro de uma subpasta (GitHub Pages: usuario.github.io/nome-do-repositorio/).
  base: './',
  build: {
    // Não publica os arquivos .map, que revelariam o código-fonte original.
    sourcemap: false,
  },
})
