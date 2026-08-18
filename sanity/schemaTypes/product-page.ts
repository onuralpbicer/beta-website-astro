import { defineField, defineType } from 'sanity';
import { pageFields, pagePreview, productOrCategoryFields } from './shared';

export default defineType({
	name: 'productPage',
	title: 'Ürün Sayfası',
	type: 'document',
	preview: pagePreview,
	fields: [
		...pageFields,
		...productOrCategoryFields,
		defineField({
			name: 'description',
			type: 'internationalizedArrayString',
			title: 'Tanımı',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'document',
			type: 'internationalizedArrayFile',
			title: 'Doküman',
		}),
		defineField({
			name: 'brand',
			type: 'internationalizedArrayString',
			title: 'Marka',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'productCode',
			type: 'internationalizedArrayString',
			title: 'Ürün Kodu',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'price',
			type: 'internationalizedArrayNumber',
			title: 'Fiyatı',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'currency',
			type: 'internationalizedArrayString',
			title: 'Para Birimi',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'taxIncluded',
			type: 'internationalizedArrayBoolean',
			title: 'Vergi Dahil mi?',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'enKeyFeatures',
			type: 'array',
			title: 'İngilizce ürün açıklaması',
			validation: (rule) => rule.required().min(1),
			of: [
				defineField({
					name: 'item',
					type: 'string',
					title: 'Açıklama',
					validation: (rule) => rule.required(),
				}),
			],
		}),
		defineField({
			name: 'trKeyFeatures',
			type: 'array',
			title: 'Türkçe ürün açıklaması',
			validation: (rule) => rule.required().min(1),
			of: [
				defineField({
					name: 'item',
					type: 'string',
					validation: (rule) => rule.required(),
				}),
			],
		}),
		defineField({
			name: 'relatedProducts',
			type: 'array',
			title: 'İlgili diğer ürünler',
			of: [
				defineField({
					type: 'reference',
					name: 'product',
					to: [{ type: 'productPage' }],
				}),
			],
		}),
	],
});
