import { parseEnv } from './src/env'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

parseEnv()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
