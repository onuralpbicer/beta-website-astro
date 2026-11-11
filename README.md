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

## CI/CD

GitHub Actions builds the site and uploads artifacts to Cloudflare Pages project
`beta-website`:

- Pull requests, merge queues, and `main` pushes run published build checks.
- `main` pushes and Sanity content changes update draft previews.
- Version tags such as `v1.2.3` release production code from `main`.
- Published Sanity changes rebuild the currently deployed production code.
- Sanity preview and production events are independently debounced for 60 seconds
  with shared Actions concurrency groups. Uploads finish without cancellation.

Public HTML bodies carry `data-version`, `data-build`, and `data-preview` for
inspection without visible version text. Production content rebuilds retain
the deployed release version and receive a new build ID.

See [docs/deployment.md](docs/deployment.md) for GitHub secrets, both Sanity
webhook templates, environment rules, activation, cleanup status, and rollback.
The workflows must be merged and secrets configured before they can deploy.

## Sanity generation

After schema changes:

```sh
pnpm sanity schema extract
pnpm sanity typegen generate
```

After GROQ query changes, run `pnpm sanity typegen generate`. Runtime queries
live in `src/shared/queries.ts`; generated types are in
`src/shared/sanity.types.ts`.
