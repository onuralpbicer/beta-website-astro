## Development

Use Node 24 to match CI and pnpm 10.33.0, pinned in `package.json`. Install
dependencies with `pnpm install --frozen-lockfile`.

When starting the dev server, use background mode:

```sh
pnpm exec astro dev --background
```

Manage the background server with `pnpm exec astro dev stop`,
`pnpm exec astro dev status`, and `pnpm exec astro dev logs`.

The Sanity perspective is selected in `astro.config.mts`: a non-empty
`SANITY_PREVIEW_TOKEN` enables drafts; an empty token uses published content.
Keep the read token in the ignored `.env` file. Use
`SANITY_PREVIEW_TOKEN='' pnpm build` to verify published output even when `.env`
contains a draft token. `pnpm preview` serves the existing `dist/` output.

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

When changing CI/CD, Sanity webhooks, release behavior, or Cloudflare hosting,
read [docs/deployment.md](docs/deployment.md). GitHub Actions owns builds;
Cloudflare Pages hosts the artifacts. Keep preview drafts separate from
published production content. Production content rebuilds must use the currently
deployed commit and hold the same concurrency lock as tag uploads while resolving,
building, and deploying. Scope debounce cancellation to jobs that cannot interrupt
an upload. Keep webhook credentials and deploy-hook URLs out of tracked files.
Release uploads store the version tag in Cloudflare's commit-message metadata;
content rebuilds must preserve it while assigning a new HTML body build ID.
Merging to `main` runs checks and a draft preview; only valid `vMAJOR.MINOR.PATCH`
tags release production code. Webhook debounce waits happen before builds:
preview cancellation covers waiting/building, while production cancellation
covers only the waiting job. Public build attributes come from
`src/shared/buildMetadata.ts` and are used by the shared layout and custom 404.
Treat the deployment document's dated remote setup notes as historical; verify
remote state before claiming secrets, webhooks, or protection rules are active.

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

The catch-all localized route is `src/pages/[lang]/[...slug]/index.astro`. Its
`getStaticPaths()` fetches the route entries, sluggable content types, shared
header/footer for each locale, and each localized page entry at build time.
It selects the page component and passes data to
`src/components/PageLayout.astro`, the shared HTML shell responsible for
canonical URLs, alternate-language links, SEO metadata, and build attributes.
UI translations live in `src/shared/translations.ts`; supported languages live
in `sanity/config.ts`.

## Sanity content model

Schema definitions live in `sanity/schemaTypes/`. The repeatable page types are
`richTextPage`, `productPage`, `productCategoriesPage`,
and `productSubcategoriesPage`. `footerColumn` is also
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
Schema extraction creates `sanity/schema.json`, which is not currently tracked.
Its output path and type generation settings are defined in `sanity.cli.ts`.
Run schema extraction before type generation when that file is absent.
Run `pnpm sanity typegen generate` after query changes, and run `pnpm build`
after route or component changes. Static generation fetches Sanity, so a build
can fail when the Sanity API or network is unavailable.

CI currently runs frozen dependency installation and a published Astro build;
there are no lint/type-check/test package scripts or explicit schema/type
generation workflow steps. For documentation-only changes, check links, paths,
and formatting without requiring a network-dependent site build.

Search indexing is currently blocked by `public/robots.txt`, `public/_headers`,
and the robots meta tag in `src/components/PageLayout.astro`, including in
production builds. Review all three together when changing launch/indexing
behavior.

If pnpm is unavailable but dependencies are installed, use the matching binary
under `node_modules/.bin/`, such as
`./node_modules/.bin/sanity typegen generate`.

Preserve unrelated worktree changes. A local `production.tar.gz` may be a
Sanity backup; do not remove it unless explicitly requested.
