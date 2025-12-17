import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    // Enable SPA fallback
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/views\/.*\.html$/, // exclude /views/*.html
          to: (context) => context.parsedUrl.pathname, // serve original file
        },
        {
          from: /./, // everything else
          to: '/index.html',
        },
      ],
    },
  },
})