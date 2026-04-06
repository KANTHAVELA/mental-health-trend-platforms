import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (id.includes('reactflow')) {
                        return 'reactflow-vendor';
                    }

                    if (id.includes('recharts')) {
                        return 'charts-vendor';
                    }

                    if (id.includes('framer-motion')) {
                        return 'motion-vendor';
                    }

                    if (id.includes('lucide-react')) {
                        return 'icons-vendor';
                    }

                    return 'vendor';
                },
            },
        },
    },
});
