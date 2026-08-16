// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { languages } from './sanity/config.ts';
import tailwindcss from '@tailwindcss/vite';
import { config } from 'dotenv';

config();

const PREVIEW_TOKEN = process.env.SANITY_PREVIEW_TOKEN;

// https://astro.build/config
export default defineConfig({
	integrations: [
		sanity({
			projectId: '12mm2gbu',
			dataset: 'production',
			useCdn: false,
			studioBasePath: '/admin',
			studioRouterHistory: 'hash',
			perspective: PREVIEW_TOKEN ? 'drafts' : 'published',
			token: PREVIEW_TOKEN,
		}),
		react(),
	],
	i18n: {
		locales: languages.map((lang) => lang.code),
		defaultLocale: 'tr',
	},
	redirects: {
		'/': '/tr/ana-sayfa',
		'/tr': '/tr/ana-sayfa',
		'/en': '/en/home',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
