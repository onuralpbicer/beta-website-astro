const curatedDescriptions: Record<string, { en: string; tr: string }> = {
	'vibration-isolation': {
		en: 'Reduce unwanted vibration, noise, and mechanical wear with isolation systems designed for industrial machinery and sensitive equipment.',
		tr: 'Endüstriyel makinelerde ve hassas ekipmanlarda istenmeyen titreşimi, gürültüyü ve mekanik aşınmayı azaltan izolasyon sistemleri.',
	},
	'titresim-izolasyonu': {
		en: 'Reduce unwanted vibration, noise, and mechanical wear with isolation systems designed for industrial machinery and sensitive equipment.',
		tr: 'Endüstriyel makinelerde ve hassas ekipmanlarda istenmeyen titreşimi, gürültüyü ve mekanik aşınmayı azaltan izolasyon sistemleri.',
	},
	'seismic-isolation': {
		en: 'Protect buildings, equipment, and critical infrastructure against earthquake forces with engineered seismic isolation and restraint solutions.',
		tr: 'Binaları, ekipmanları ve kritik altyapıları deprem etkilerine karşı korumak için tasarlanmış sismik izolasyon ve sınırlama çözümleri.',
	},
	'sismik-izolasyon': {
		en: 'Protect buildings, equipment, and critical infrastructure against earthquake forces with engineered seismic isolation and restraint solutions.',
		tr: 'Binaları, ekipmanları ve kritik altyapıları deprem etkilerine karşı korumak için tasarlanmış sismik izolasyon ve sınırlama çözümleri.',
	},
	'shock-impact-control': {
		en: 'Manage sudden loads and impact energy with shock absorbers and restraint systems built for demanding mechanical applications.',
		tr: 'Zorlu mekanik uygulamalarda ani yükleri ve darbe enerjisini kontrol etmek için geliştirilen şok emici ve sınırlayıcı sistemler.',
	},
	'sok-darbe-kontrolu': {
		en: 'Manage sudden loads and impact energy with shock absorbers and restraint systems built for demanding mechanical applications.',
		tr: 'Zorlu mekanik uygulamalarda ani yükleri ve darbe enerjisini kontrol etmek için geliştirilen şok emici ve sınırlayıcı sistemler.',
	},
	'marine-systems': {
		en: 'Equip yachts and leisure vessels with reliable onboard systems for cooling, water treatment, and sanitation.',
		tr: 'Yatlar ve gezi tekneleri için soğutma, su arıtma ve hijyen ihtiyaçlarını karşılayan güvenilir yerleşik denizcilik sistemleri.',
	},
	'denizcilik-sistemleri': {
		en: 'Equip yachts and leisure vessels with reliable onboard systems for cooling, water treatment, and sanitation.',
		tr: 'Yatlar ve gezi tekneleri için soğutma, su arıtma ve hijyen ihtiyaçlarını karşılayan güvenilir yerleşik denizcilik sistemleri.',
	},
	'asvd-series-shock-absorbers': {
		en: 'Compact shock absorbers for reducing transmitted impact energy and protecting equipment in demanding installations.',
		tr: 'Zorlu kurulumlarda iletilen darbe enerjisini azaltmak ve ekipmanı korumak için kompakt şok emiciler.',
	},
	'asvd-serisi-sok-alicilar': {
		en: 'Compact shock absorbers for reducing transmitted impact energy and protecting equipment in demanding installations.',
		tr: 'Zorlu kurulumlarda iletilen darbe enerjisini azaltmak ve ekipmanı korumak için kompakt şok emiciler.',
	},
	'isolation-plates': {
		en: 'Low-profile isolation plates that help separate equipment from structure-borne vibration and installation noise.',
		tr: 'Ekipmanı yapısal titreşimlerden ve kurulum kaynaklı gürültüden ayırmaya yardımcı olan düşük profilli izolasyon levhaları.',
	},
	'yalitim-levhalari': {
		en: 'Low-profile isolation plates that help separate equipment from structure-borne vibration and installation noise.',
		tr: 'Ekipmanı yapısal titreşimlerden ve kurulum kaynaklı gürültüden ayırmaya yardımcı olan düşük profilli izolasyon levhaları.',
	},
	'ceiling-hangers': {
		en: 'Suspended isolation solutions for supporting mechanical services while limiting vibration transfer through ceilings and structures.',
		tr: 'Mekanik tesisatları taşırken titreşimin tavan ve yapı üzerinden iletimini sınırlayan asma izolasyon çözümleri.',
	},
	'izolasyon-askilari': {
		en: 'Suspended isolation solutions for supporting mechanical services while limiting vibration transfer through ceilings and structures.',
		tr: 'Mekanik tesisatları taşırken titreşimin tavan ve yapı üzerinden iletimini sınırlayan asma izolasyon çözümleri.',
	},
};

export function getCategoryDescription(
	slug: string | null | undefined,
	locale: string,
	description?: string | null,
) {
	if (description?.trim()) return description;

	const slugKey = slug?.split('/').filter(Boolean).at(-1);
	const curated = slugKey ? curatedDescriptions[slugKey] : undefined;

	return curated?.[locale === 'en' ? 'en' : 'tr'] ?? null;
}
