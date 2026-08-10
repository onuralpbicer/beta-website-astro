import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'appHeader',
	title: 'Uygulama Başlığı',
	description: 'Bundan sadece bir tane yaratin!!!',
	preview: {
		prepare() {
			return { title: 'Uygulama Başlığı, sadece bir tane!!!' };
		},
	},
	type: 'document',
	fields: [
		defineField({
			name: 'logo',
			type: 'image',
			options: { hotspot: true },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'opengraph_logo',
			type: 'image',
			options: { hotspot: true },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'headerLinks',
			type: 'array',
			of: [
				defineField({
					type: 'reference',
					name: 'headerLinks',
					to: [
						{ type: 'richTextPage' },
						{ type: 'servicesPage' },
						{ type: 'productCategoriesPage' },
						{ type: 'productSubcategoriesPage' },
						{ type: 'productPage' },
					],
				}),
			],
		}),
	],
});
