import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
	api: {
		projectId: '12mm2gbu',
		dataset: 'production',
	},
	deployment: {
		/**
		 * Enable auto-updates for studios.
		 * Learn more at https://www.sanity.io/docs/cli#auto-updates
		 */
		autoUpdates: true,
	},
	typegen: {
		enabled: true,
		path: './src/**/*.{ts,tsx,js,jsx}', // glob pattern to your typescript files. Can also be an array of paths
		schema: './sanity/schema.json', // path to your schema file, generated with 'sanity schema extract' command
		generates: './src/shared/sanity.types.ts', // path to the output file for generated type definitions
		overloadClientMethods: true, // set to false to disable automatic overloading the sanity client
		formatGeneratedCode: true,
	},
	schemaExtraction: {
		enabled: true,
		path: './sanity',
		watchPatterns: ['./sanity/schemaTypes/*.ts'],
	},
});
