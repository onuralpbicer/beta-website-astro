import { defineType, defineField } from 'sanity';
import { pageFields, pagePreview } from './shared';

export default defineType({
	name: 'homePage',
	title: 'Ana sayfa',
	type: 'document',
	description: 'Bundan sadece bir tane yaratin!!!',
	preview: pagePreview,
	fields: [
		...pageFields,
		defineField({
			name: 'heroImage',
			type: 'image',
			title: 'Ana Foto',
			options: { hotspot: true },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'heroTitle',
			title: 'Ana Başlık',
			type: 'internationalizedArrayString',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'heroDescription',
			title: 'Ana Altyazı',
			type: 'internationalizedArrayString',
			validation: (r) => r.required(),
		}),

		defineField({
			name: 'linkTo',
			title: 'Link Sayfası',
			type: 'reference',
			to: [
				{ type: 'richTextPage' },
				{ type: 'servicesPage' },
				{ type: 'productCategoriesPage' },
				{ type: 'productSubcategoriesPage' },
				{ type: 'productPage' },
			],
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'linkText',
			title: 'Link Yazısı',
			type: 'internationalizedArrayString',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'keywords',
			title: 'Anahtar Kelimeler',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'featuredTitle',
			title: 'Öne Çıkanlar Başlığı',
			type: 'internationalizedArrayString',
			validation: (r) => r.required(),
		}),

		defineField({
			name: 'featured',
			title: 'Öne Çıkanlar',
			type: 'array',
			of: [
				defineField({
					type: 'reference',
					name: 'featured',
					to: [
						{ type: 'productCategoriesPage' },
						{ type: 'productSubcategoriesPage' },
						{ type: 'productPage' },
					],
				}),
			],
		}),
	],
});
