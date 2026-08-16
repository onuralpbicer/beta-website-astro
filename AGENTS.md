## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Sanity schema and type generation

After changing files in `sanity/schemaTypes/`, regenerate the Sanity schema and
TypeScript types:

```sh
pnpm sanity schema extract
pnpm sanity typegen generate
```

After updating any GROQ query, run TypeScript type generation:

```sh
pnpm sanity typegen generate
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project Context

This is an Astro 7 static website backed by Sanity. The Sanity Studio is embedded
at `/admin`; the site and Studio use project `12mm2gbu`, dataset `production`.
Supported locales are English (`en`) and Turkish (`tr`), with Turkish as the
default locale. Public routes use localized slugs, including `/tr/ana-sayfa` and
`/en/home`.

The main shared document shell is `src/components/PageLayout.astro`. It fetches
the header, footer, and localized page entry, then handles canonical URLs,
alternate-language links, and SEO metadata. The catch-all localized route is
`src/pages/[lang]/[...slug]/index.astro`.

## Sanity content model

Schema definitions live in `sanity/schemaTypes/`. The repeatable page types are
`richTextPage`, `productPage`, `productCategoriesPage`,
`productSubcategoriesPage`, and `servicesPage`. `footerColumn` is also
repeatable and is referenced by `footer`.

The following are singletons and must use fixed document IDs equal to their type
names: `homePage`, `servicesPage`, `appHeader`, and `footer`. They are configured
in `sanity.config.ts`; do not create additional generated-ID instances or add
these types back to the general document list.

The project uses `sanity-plugin-internationalized-array` v5. Localized array
items store the locale in `language`; `_key` is only the normal Sanity array-item
identity. Runtime GROQ should use `language`, for example:

```groq
title[language == $locale][0].value
```

Do not reintroduce `_key` as a locale lookup or fallback after migration.

## Internationalized-array migration

The v4-to-v5 data migration is defined in
`migrations/migrateToLanguageField.ts`. Its `DOCUMENT_TYPES` list must cover
every document type containing an `internationalizedArray*` field:
`footerColumn`, `homePage`, `richTextPage`, `productPage`,
`productSubcategoriesPage`, `productCategoriesPage`, and `servicesPage`.

Before running a production migration, create a Sanity backup and run a dry run:

```sh
sanity dataset export production
pnpm sanity migration run migrateToLanguageField
pnpm sanity migration run migrateToLanguageField --no-dry-run
```

Confirm the target dataset and backup before using `--no-dry-run`. Sanity
mutations, migrations, document deletion, and dataset imports are external or
destructive operations; verify exact IDs first.

## Styling and verification

Tailwind CSS v4 is wired through `@tailwindcss/vite`; there is no Tailwind
config file to edit. Shared design tokens and the default page background live
in `src/styles/global.css`. Prefer the existing CSS variables and utility
classes before introducing one-off colors or duplicated layout styles. Use 
Tailwind for styling instead of creating custom normal css in <style> blocks.

`src/shared/queries.ts` is the source of truth for GROQ queries.
`src/shared/sanity.types.ts` is generated and should not be edited by hand.
Run `pnpm sanity typegen generate` after query changes, and run `pnpm build`
after route or component changes. Static generation fetches Sanity, so a build
can fail when the Sanity API or network is unavailable.

If pnpm is unavailable but dependencies are installed, use the matching binary
under `node_modules/.bin/`, such as
`./node_modules/.bin/sanity typegen generate`.

Preserve unrelated worktree changes. A local `production.tar.gz` may be a
Sanity backup; do not remove it unless explicitly requested.
