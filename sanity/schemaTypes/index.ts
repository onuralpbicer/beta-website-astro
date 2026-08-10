import { blockContent } from './shared';
import richTextPage from './rich-text-page';
import productPage from './product-page';
import productSubcategoriesPage from './product-subcategories-page';
import productCategoriesPage from './product-categories-page';
import servicesPage from './services-page';
import whyUs from './why-us';
import homePage from './home-page';
import appHeader from './app-header';
import footerColumn from './footer-column';
import footer from './footer';

export const schemaTypes = [
	blockContent,
	whyUs,
	appHeader,
	footerColumn,
	footer,

	// pages
	homePage,
	richTextPage,
	productPage,
	productSubcategoriesPage,
	productCategoriesPage,
	servicesPage,
];
