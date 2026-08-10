import { defineType } from 'sanity';
import { pageFields, pagePreview, productListFields, productOrCategoryFields } from './shared';

export default defineType({
	name: 'productSubcategoriesPage',
	title: 'Ürün Alt Kategorisi Sayfası',
	type: 'document',
	preview: pagePreview,
	fields: [
		...pageFields,
		...productOrCategoryFields,
		...productListFields('Ürünler', ['productPage']),
	],
});
