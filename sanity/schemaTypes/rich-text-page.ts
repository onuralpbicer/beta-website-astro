import { defineField, defineType } from 'sanity';
import { pageFields, pagePreview } from './shared';

export default defineType({
	name: 'richTextPage',
	title: 'Yazılı Sayfa',
	type: 'document',
	preview: pagePreview,
	fields: [
		...pageFields,
		defineField({
			name: 'content',
			type: 'internationalizedArrayBlockContent',
			title: 'İçerik',
			validation: (rule) => rule.required(),
		}),
	],
});
