export const translations = {
	en: {
		siteTitle: 'Beta Engineering',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
		},
	},
	tr: {
		siteTitle: 'Beta Mühendislik',
		homeHero: {
			eyebrow: 'EST. 1997 | TÜRKİYE',
		},
	},
} as const;

export type SupportedLocale = keyof typeof translations;
export type Translation = (typeof translations)[SupportedLocale];

export function getTranslations(locale: string): Translation {
	return translations[locale as SupportedLocale] ?? translations.tr;
}
