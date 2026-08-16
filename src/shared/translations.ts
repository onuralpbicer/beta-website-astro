export const translations = {
	en: {
		siteTitle: 'Beta Engineering',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
		},
		product: {
			brand: 'Brand',
			productCode: 'Product Code',
			vatIncluded: 'VAT Included',
			vatExcluded: 'VAT Excluded',
			contact: 'Contact Us',
			downloadBrochure: 'Download Brochure',
			featuresEyebrow: 'KEY FEATURES',
			featuresTitle: 'Product Features & Benefits',
			featuresEmpty: 'Product features coming soon.',
			catalogEyebrow: 'CATALOG',
			relatedTitle: 'Related Products',
			viewProduct: 'View Product',
		},
	},
	tr: {
		siteTitle: 'Beta Mühendislik',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
		},
		product: {
			brand: 'Marka',
			productCode: 'Ürün Kodu',
			vatIncluded: 'KDV Dahil',
			vatExcluded: 'KDV Hariç',
			contact: 'Bize Ulaşın',
			downloadBrochure: 'Broşür İndir',
			featuresEyebrow: 'ÖNE ÇIKAN DETAYLAR',
			featuresTitle: 'Ürün Özellikleri & Avantajları',
			featuresEmpty: 'Ürün özellikleri yakında eklenecek.',
			catalogEyebrow: 'KATALOG',
			relatedTitle: 'İlgili Diğer Ürünler',
			viewProduct: 'Ürüne Git',
		},
	},
} as const;

export type SupportedLocale = keyof typeof translations;
export type Translation = (typeof translations)[SupportedLocale];

export function getTranslations(locale: string): Translation {
	return translations[locale as SupportedLocale] ?? translations.tr;
}
