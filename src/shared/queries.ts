import groq from 'groq';

export const headerInfoQuery = groq`*[_type == "appHeader" && _id == "appHeader"][0]{
  logo{ asset->{ url } },
  opengraph_logo{ asset->{ url } },
  headerLinks[]->{
    _type,
    "title": title[language == $locale][0].value,
    "slug": slug[language == $locale][0].value
  }
}`;

export const sluggableContentTypesQuery = groq`array::unique(
  *[
    defined(slug) &&
    count(slug) > 0
  ]._type
)`;

export const getEntryBySlugAndLocale = groq`*[
  _type in $types &&
  coalesce(slug[language == $locale][0].value, slug[language == $locale][0].value) == $slug
]{
  _id,
  _type,
  "title": coalesce(
    title[language == $locale][0].value,
    title[language == "tr"][0].value
  ),
  "metaDescription": coalesce(
    metaDescription[language == $locale][0].value,
    metaDescription[language == "tr"][0].value
  ),
  "slug": coalesce(
    slug[language == $locale][0].value,
    slug[language == "tr"][0].value
  ),
  "slugs": slug[]{
    "code": language,
    "slug": value
  },
	// Type-specific payload
  "page": select(
    _type == "richTextPage" => {
      "content": coalesce(
        content[language == $locale][0].value,
        content[language == "tr"][0].value
      )
    },

    _type == "homePage" => {
      "heroTitle": coalesce(heroTitle[language == $locale][0].value, heroTitle[language == "tr"][0].value),
      "heroDescription": coalesce(heroDescription[language == $locale][0].value, heroDescription[language == "tr"][0].value),
      heroImage{ asset->{ url } },
      "linkText": coalesce(linkText[language == $locale][0].value, linkText[language == "tr"][0].value),
      linkTo->{
        _type,
        "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
        "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value)
      },
			"contactLinkText": coalesce(contactLinkText[language == $locale][0].value, contactLinkText[language == "tr"][0].value),
			contactLinkTo->{
				_type,
				"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
				"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value)
			},
			"featuredTitle": coalesce(featuredTitle[language == $locale][0].value, featuredTitle[language == "tr"][0].value),
      featured[]->{
        _type,
        "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
        "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
        "description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value)
      },
     "keywords": string::split(
        coalesce(keywords[language == $locale][0].value, keywords[language == "tr"][0].value),
        ","
      )
    },

    _type == "productCategoriesPage" => {
			"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
				"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
				"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
				"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
				"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
				"tags": string::split(coalesce(tags[language == $locale][0].value, tags[language == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
						_type,
						"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
						"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
						"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
						"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
						"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
						"image": select(defined(image) => image.asset->url, null),
						"products": null
					},
					null
				),
			}
		},

    _type == "productSubcategoriesPage" => {
			"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
				"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
				"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
				"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
				"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
				"tags": string::split(coalesce(tags[language == $locale][0].value, tags[language == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
						_type,
						"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
						"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
						"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
						"image": select(defined(image) => image.asset->url, null),
						"products": null
					},
					null
				),
			}
		},

    _type == "servicesPage" => {
			"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
				"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
				"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
				"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
				"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
				"tags": string::split(coalesce(tags[language == $locale][0].value, tags[language == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
						_type,
						"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
						"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
						"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
						"image": select(defined(image) => image.asset->url, null),
						"products": null
					},
					null
				),
			}
		},

    _type == "productPage" => {
			"description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
			"document": {
				"url": coalesce(document[language == $locale][0].value.asset->url, document[language == "tr"][0].value.asset->url), 
				"name": coalesce(document[language == $locale][0].value.asset->originalFilename, document[language == "tr"][0].value.asset->originalFilename),
			},
			"brand": coalesce(brand[language == $locale][0].value, brand[language == "tr"][0].value),
			"productCode": coalesce(productCode[language == $locale][0].value, productCode[language == "tr"][0].value),
			"image": select(
					defined(image) => image.asset->url,
					null
			),
			"price": {
				"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
				"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
				"taxIncluded": coalesce(taxIncluded[language == $locale][0].value, taxIncluded[language == "tr"][0].value),
			},
			"keyFeatures": select(
				$locale == "en" => enKeyFeatures,
				$locale == "tr" => trKeyFeatures,
				trKeyFeatures
			),
			relatedProducts[]->{
					"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
					"title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
					"price": coalesce(price[language == $locale][0].value, price[language == "tr"][0].value),
					"currency": coalesce(currency[language == $locale][0].value, currency[language == "tr"][0].value),
					"image": select(
						defined(image) => image.asset->url,
						null
					),
			},
			"parent": coalesce(parent->slug[language == $locale][0].value, parent->slug[language == "tr"][0].value)
		},

    // default
    {}

  )
}[0]`;

export const getHomePageQuery = groq`*[_type == 'homePage' && _id == 'homePage']{
  "slug": slug[language == $locale][0].value
}[0]`;

export const getEntriesQuery = groq`*[defined(slug) && count(slug) > 0].slug[]{
  "locale": language,
  "slug": value
}`;

export const getFooterQuery = groq`*[_type == 'footer' && _id == 'footer']{
  copyright,
  footerColumns[]-> {
    "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
    links[]-> {
      "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
      "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
    }
  }
}[0]`;

export const getServicesQuery = groq`*[_type == 'servicesPage' && _id == 'servicesPage']{
  "description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
	"slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
  products[]->{
    _type,
    "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
    "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
    "description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
    "products": select(
      defined(products) => products[]->{
        _type,
        "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
        "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
        "description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
        "products": select(
          defined(products) => products[]->{
            _type,
            "slug": coalesce(slug[language == $locale][0].value, slug[language == "tr"][0].value),
            "title": coalesce(title[language == $locale][0].value, title[language == "tr"][0].value),
            "description": coalesce(description[language == $locale][0].value, description[language == "tr"][0].value),
            "products": null
          },
          null
        )
      },
      null
    ),
  }
}[0]`;
