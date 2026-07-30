import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 58843,
        proxy: {
            '/api': {
                target: 'https://localhost:7240',
                changeOrigin: true,
                secure: false,
            },
            '/images': {
                target: 'https://localhost:7240',
                changeOrigin: true,
                secure: false,
            },
        },
    }
})