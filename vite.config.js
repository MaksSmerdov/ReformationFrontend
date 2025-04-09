import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@services': path.resolve(__dirname, 'src/services'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@slices': path.resolve(__dirname, 'src/slices'),
			'@routes': path.resolve(__dirname, 'src/routes'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
			'@contexts': path.resolve(__dirname, 'src/contexts')
		}
	},
	root: './',
	build: {
		outDir: 'dist'
	},
	server: {
		host: '0.0.0.0',
		port: 7358,
		proxy: {
			'/api': {
				target: process.env.VITE_API_URL, // || 'https://teditori2.gromi.fi'
				changeOrigin: true,
				secure: false
			},
			'/storage': {
				target: process.env.VITE_API_URL,
				changeOrigin: true,
				secure: false
			}
			// '/socket.io': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io/*': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io/**': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io-client': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io-client/*': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io-client/**': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
			// '/socket.io-client/socket.io': {
			// 	target: process.env.VITE_API_URL,
			// 	changeOrigin: true,
			// 	secure: false
			// },
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true // Это ключевая опция для подавления предупреждений
			}
		}
	}
});
