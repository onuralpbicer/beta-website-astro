import { defineType } from 'sanity';
import { pageFields, pagePreview, productListFields } from './shared';

export default defineType({
	name: 'servicesPage',
	title: 'Hizmetler Sayfası',
	description: 'Bundan sadece bir tane yaratin!!!',
	type: 'document',
	preview: pagePreview,
	fields: [
		...pageFields,
		...productListFields('Ürün kategorileri, alt kategorileri veya ürünler', [
			'productCategoriesPage',
			'productSubcategoriesPage',
			'productPage',
		]),
	],
});
