import { defineType } from 'sanity';
import { pageFields, pagePreview, productListFields, productOrCategoryFields } from './shared';

export default defineType({
	name: 'productCategoriesPage',
	title: 'Ürün Kategorisi Sayfası',
	type: 'document',
	preview: pagePreview,
	fields: [
		...pageFields,
		...productOrCategoryFields,
		...productListFields('Ürün alt kategorileri veya ürünler', [
			'productSubcategoriesPage',
			'productPage',
		]),
	],
});
