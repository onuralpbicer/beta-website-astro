// ./migrations/migrateToLanguageField.ts
import {migrateToLanguageField} from 'sanity-plugin-internationalized-array/migrations'

// Add the document types that contain internationalized arrays.
// Example: ['internationalizedPost', 'translation.metadata']
const DOCUMENT_TYPES: string[] = [
	'footerColumn',
	'homePage',
	'richTextPage',
	'productPage',
	'productSubcategoriesPage',
	'productCategoriesPage',
	'servicesPage',
]

export default migrateToLanguageField(DOCUMENT_TYPES)
