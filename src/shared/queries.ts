import groq from 'groq';

export const headerInfoQuery = groq`*[_type == "appHeader"][0]{
  logo{ asset->{ url } },
  opengraph_logo{ asset->{ url } },
  headerLinks[]->{
    _type,
    "title": title[_key == $locale][0].value,
    "slug": slug[_key == $locale][0].value
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
  coalesce(slug[_key == $locale][0].value, slug[_key == $locale][0].value) == $slug
]{
  _id,
  _type,
  "title": coalesce(
    title[_key == $locale][0].value,
    title[_key == "tr"][0].value
  ),
  "metaDescription": coalesce(
    metaDescription[_key == $locale][0].value,
    metaDescription[_key == "tr"][0].value
  ),
  "slug": coalesce(
    slug[_key == $locale][0].value,
    slug[_key == "tr"][0].value
  ),
  "slugs": slug[]{
    "code": _key,
    "slug": value
  },
	// Type-specific payload
  "page": select(
    _type == "richTextPage" => {
      "content": coalesce(
        content[_key == $locale][0].value,
        content[_key == "tr"][0].value
      )
    },

    _type == "homePage" => {
      "heroTitle": coalesce(heroTitle[_key == $locale][0].value, heroTitle[_key == "tr"][0].value),
      "heroDescription": coalesce(heroDescription[_key == $locale][0].value, heroDescription[_key == "tr"][0].value),
      heroImage{ asset->{ url } },
      "linkText": coalesce(linkText[_key == $locale][0].value, linkText[_key == "tr"][0].value),
      linkTo->{
        _type,
        "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
        "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value)
      },
			"contactLinkText": coalesce(contactLinkText[_key == $locale][0].value, contactLinkText[_key == "tr"][0].value),
			contactLinkTo->{
				_type,
				"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
				"title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value)
			},
			"featuredTitle": coalesce(featuredTitle[_key == $locale][0].value, featuredTitle[_key == "tr"][0].value),
      featured[]->{
        _type,
        "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
        "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
        "image": select(
          defined(image) => image.asset->url,
          null
        )
      },
     "keywords": string::split(
        coalesce(keywords[_key == $locale][0].value, keywords[_key == "tr"][0].value),
        ","
      )
    },

    _type == "productCategoriesPage" => {
			"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
				"title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
				"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
				"tags": string::split(coalesce(tags[_key == $locale][0].value, tags[_key == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
					_type
					},
					null
				),
			}
		},

    _type == "productSubcategoriesPage" => {
			"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
				"title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
				"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
				"tags": string::split(coalesce(tags[_key == $locale][0].value, tags[_key == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
					_type
					},
					null
				),
			}
		},

    _type == "servicesPage" => {
			"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
			products[]->{
				_type,
				"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
				"title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
				"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
				"tags": string::split(coalesce(tags[_key == $locale][0].value, tags[_key == "tr"][0].value), ','),
				"image": select(
					defined(image) => image.asset->url,
					null
				),
				"products": select(
					defined(products) => products[]->{
					_type
					},
					null
				),
			}
		},

    _type == "productPage" => {
			"description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
			"document": {
				"url": coalesce(document[_key == $locale][0].value.asset->url, document[_key == "tr"][0].value.asset->url), 
				"name": coalesce(document[_key == $locale][0].value.asset->originalFilename, document[_key == "tr"][0].value.asset->originalFilename),
			},
			"brand": coalesce(brand[_key == $locale][0].value, brand[_key == "tr"][0].value),
			"productCode": coalesce(productCode[_key == $locale][0].value, productCode[_key == "tr"][0].value),
			"image": select(
					defined(image) => image.asset->url,
					null
			),
			"price": {
				"price": coalesce(price[_key == $locale][0].value, price[_key == "tr"][0].value),
				"currency": coalesce(currency[_key == $locale][0].value, currency[_key == "tr"][0].value),
				"taxIncluded": coalesce(taxIncluded[_key == $locale][0].value, taxIncluded[_key == "tr"][0].value),
			},
			"keyFeatures": select(
				$locale == "en" => enKeyFeatures,
				$locale == "tr" => trKeyFeatures,
				trKeyFeatures
			),
			relatedProducts[]->{
					"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
					"title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
					"price": coalesce(price[_key == $locale][0].value, price[_key == "tr"][0].value),
					"currency": coalesce(currency[_key == $locale][0].value, currency[_key == "tr"][0].value),
					"image": select(
						defined(image) => image.asset->url,
						null
					),
			},
			"parent": coalesce(parent->slug[_key == $locale][0].value, parent->slug[_key == "tr"][0].value)
		},

    // default
    {}

  )
}[0]`;

export const getHomePageQuery = groq`*[_type == 'homePage' && _id == 'homePage']{
  "slug": slug[_key == $locale][0].value
}[0]`;

export const getEntriesQuery = groq`*[defined(slug) && count(slug) > 0].slug[]{
  "locale": _key,
  "slug": value
}`;

export const getFooterQuery = groq`*[_type == 'footer' && _id == 'footer']{
  copyright,
  footerColumns[]-> {
    "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
    links[]-> {
      "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
      "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
    }
  }
}[0]`;

export const getServicesQuery = groq`*[_type == 'servicesPage']{
  "description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
	"slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
  products[]->{
    _type,
    "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
    "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
    "products": select(
      defined(products) => products[]->{
        _type,
        "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
        "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
        "description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
        "products": select(
          defined(products) => products[]->{
            _type,
            "slug": coalesce(slug[_key == $locale][0].value, slug[_key == "tr"][0].value),
            "title": coalesce(title[_key == $locale][0].value, title[_key == "tr"][0].value),
            "description": coalesce(description[_key == $locale][0].value, description[_key == "tr"][0].value),
            "products": null
          },
          null
        )
      },
      null
    ),
  }
}[0]`;
