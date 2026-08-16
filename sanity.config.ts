import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { languages } from './sanity/config.ts';
import { trTRLocale } from '@sanity/locale-tr-tr';
import { schemaTypes } from './sanity/schemaTypes';

const isProduction = process.env.NODE_ENV === 'production';

const singletonTypes = new Set(['homePage']);
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
	name: 'default',
	title: 'beta-website',

	projectId: '12mm2gbu',
	dataset: 'production',

	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						S.listItem()
							.title('Ana Sayfa')
							.id('homePage')
							.child(
								S.document()
									.schemaType('homePage')
									.documentId('homePage'),
							),

						...S.documentTypeListItems().filter(
							(item) => !singletonTypes.has(item.getId() ?? ''),
						),
					]),
		}),
		internationalizedArray({
			languages,
			defaultLanguages: ['en', 'tr'],
			fieldTypes: ['string', 'blockContent', 'file', 'number', 'boolean'],
		}),
		...(isProduction ? [trTRLocale()] : [visionTool()]),
	],

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
	},
	document: {
		actions: (input, context) =>
			singletonTypes.has(context.schemaType)
				? input.filter(
						({ action }) => action && singletonActions.has(action),
					)
				: input,
	},
});
