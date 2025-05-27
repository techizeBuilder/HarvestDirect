import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'express',
        'cors',
        '@neondatabase/serverless',
        'drizzle-orm',
        'bcrypt',
        'jsonwebtoken',
        'razorpay',
        'nodemailer',
        'ws',
        'zod'
      ]
    },
    target: 'node18',
    outDir: 'dist'
  }
})