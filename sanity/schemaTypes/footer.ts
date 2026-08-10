import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'footer',
	title: 'Altbilgi',
	description: 'Bundan sadece bir tane yaratin!!!',
	type: 'document',
	fields: [
		defineField({
			name: 'copyright',
			title: 'Telif Hakkı Metni',
			type: 'string',
			validation: (r) => r.required(),
		}),

		defineField({
			name: 'footerColumns',
			type: 'array',
			title: 'Altbilgi Sütunları',
			of: [
				defineField({ type: 'reference', name: 'footerColumns', to: [{ type: 'footerColumn' }] }),
			],
		}),
	],
});
