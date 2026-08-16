export const translations = {
	en: {
		siteTitle: 'Beta Engineering',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
			contactLinkText: 'Contact Us',
			contactKeywords: ['contact'],
		},
	},
	tr: {
		siteTitle: 'Beta Mühendislik',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
			contactLinkText: 'Bize Ulaşın',
			contactKeywords: ['ileti'],
		},
	},
} as const;

export type SupportedLocale = keyof typeof translations;
export type Translation = (typeof translations)[SupportedLocale];

export function getTranslations(locale: string): Translation {
	return translations[locale as SupportedLocale] ?? translations.tr;
}
