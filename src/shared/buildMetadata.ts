// Read at build time; only these non-secret values reach the generated HTML.
export const buildAttributes = {
	'data-version': import.meta.env.SITE_VERSION || 'development',
	'data-build': import.meta.env.SITE_BUILD_NUMBER || 'local',
	'data-preview': import.meta.env.SITE_VERSION === 'preview' ? 'true' : 'false',
};
