import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
    host: true,
		port: 8080,
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			"tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
		}
	},
	build: {
		outDir: '../parlo/public/desk',
		emptyOutDir: true,
		target: 'es2015',
		commonjsOptions: {
			include: [/tailwind.config.js/, /node_modules/],
		  }
	},
	optimizeDeps: {
		include: ["feather-icons", "showdown", "tailwind.config.js"],
	  },
});
