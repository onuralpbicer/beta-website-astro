# Beta website

An Astro static website with an embedded Sanity Studio at `/admin`. Content
comes from Sanity project `12mm2gbu`, dataset `production`. Turkish is the default
locale; the public home routes are `/tr/ana-sayfa` and `/en/home`.

## Local development

Use Node 24 and the pnpm version pinned in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm exec astro dev --background
```

Manage the server with `pnpm exec astro dev status`, `pnpm exec astro dev logs`,
and `pnpm exec astro dev stop`. See [AGENTS.md](AGENTS.md) for repository rules.

```sh
# Published production build
SANITY_PREVIEW_TOKEN='' pnpm build

# Draft build when .env contains a read-only SANITY_PREVIEW_TOKEN
pnpm build

# Serve the generated dist directory locally
pnpm preview
```

Static generation requires access to the Sanity API. Store the optional preview
read token in the ignored `.env` file. Build output is written to `dist/`.
`pnpm preview` serves that existing output; it does not fetch new CMS content.

## Repository structure

| Path                                     | Responsibility                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `astro.config.mts`                       | Astro integrations, Sanity perspective, locale configuration, and home redirects |
| `src/pages/[lang]/[...slug]/index.astro` | Static route generation, Sanity fetching, and page component selection           |
| `src/components/PageLayout.astro`        | Shared HTML shell, navigation, footer, SEO, and build attributes                 |
| `src/shared/queries.ts`                  | Runtime GROQ queries                                                             |
| `src/shared/translations.ts`             | UI translations                                                                  |
| `src/styles/global.css`                  | Tailwind v4 setup and shared design tokens                                       |
| `sanity/schemaTypes/`                    | Sanity document and field schemas                                                |
| `sanity.config.ts`                       | Embedded Studio, singleton documents, and localization plugin                    |
| `sanity.cli.ts`                          | Schema extraction and TypeScript generation configuration                        |
| `.github/workflows/`                     | Build checks, draft previews, and production deployments                         |

`sanity/config.ts` defines the supported languages. Both the site and Studio use
the same dataset; setting `SANITY_PREVIEW_TOKEN` selects drafts, and leaving it
empty selects published content. The Studio uses hash routing under `/admin`.

## CI/CD

GitHub Actions builds the site and uploads artifacts to Cloudflare Pages project
`beta-website`:

- Pull requests, merge queues, and `main` pushes run published build checks.
- `main` pushes, manual runs on `main`, and `sanity-preview` events build draft previews.
- Version tags such as `v1.2.3` release production code from `main`.
- `sanity-production` events and manual production content runs on `main`
  rebuild the currently deployed production commit with published content.
- Webhook events wait 60 seconds **before building**. New events replace waiting
  jobs in the same debounce group. Preview builds can also be cancelled;
  production rebuilds and active uploads finish without cancellation.

Merging to `main` does not release production code. PRs only run build checks;
there are no per-PR preview deployments. Preview and production uploads use the
same Pages project with branch labels `main` and `production`, respectively.

Public HTML bodies carry `data-version`, `data-build`, and `data-preview` for
inspection without visible version text. Production content rebuilds retain
the deployed release version and receive a new build ID.

See [docs/deployment.md](docs/deployment.md) for GitHub secrets, both Sanity
webhook templates, environment rules, activation, cleanup status, and rollback.
Deployment requires the workflows on `main`, configured secrets and environment
rules, and authenticated, enabled webhooks for CMS-triggered builds. The dated
setup record in that document is historical, not a live configuration check.

## Sanity generation

After schema changes:

```sh
pnpm sanity schema extract
pnpm sanity typegen generate
```

After GROQ query changes, run `pnpm sanity typegen generate`. Runtime queries
live in `src/shared/queries.ts`; generated types are in
`src/shared/sanity.types.ts`.

Schema extraction creates `sanity/schema.json` (not currently tracked); type
generation updates the tracked `src/shared/sanity.types.ts`. Do not edit either
generated file by hand. See [AGENTS.md](AGENTS.md) for singleton and localized-field
rules and production migration precautions.

## Verification and launch status

CI installs dependencies with the frozen lockfile and runs `pnpm build` using
Node 24. There are currently no lint, type-check, or test package scripts, and
schema/type generation is not an explicit workflow step.

Search indexing is currently disabled in `public/robots.txt`, `public/_headers`,
and the robots meta tag in `src/components/PageLayout.astro`. These rules apply
to production builds too; review all three before enabling public indexing.
