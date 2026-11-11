# GitHub Actions CI/CD

All builds run in GitHub Actions. Cloudflare Pages hosts the built files in the
existing `beta-website` project, account `dba4a4829a48119d0a35590a29f11b91`.
Develop on short-lived branches and merge pull requests into `main`.

| Trigger                                   | Content and code                                        | Result                              |
| ----------------------------------------- | ------------------------------------------------------- | ----------------------------------- |
| PR to `main`, merge queue, or `main` push | Published content                                       | `CI` build check                    |
| `main` push or manual `Preview` run       | Draft content, current `main`                           | Preview upload                      |
| Sanity `sanity-preview` event             | Draft content, current `main`                           | Debounced preview upload            |
| Push `vMAJOR.MINOR.PATCH` tag             | Published content, tagged commit on `main`              | Production code release             |
| Sanity `sanity-production` event          | Published content, currently deployed production commit | Debounced production content update |
| Manual `Production content` run on `main` | Published content, currently deployed production commit | Production content update           |

The Pages production branch label is `production`. Uploads explicitly select
`--branch=production` or `--branch=main`; no separate production Git branch is
needed. Preview and production share the Sanity `production` dataset but use
different perspectives. The static preview host serves drafts baked into its
last successful build.

## GitHub secrets and protection

The user will configure these secrets in `onuralpbicer/beta-website-astro`:

| Location                        | Secret                 | Value                                                                                             |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| Repository Actions secrets      | `SANITY_PREVIEW_TOKEN` | Read-only Sanity token with draft access in project `12mm2gbu`                                    |
| GitHub environment `preview`    | `CLOUDFLARE_API_TOKEN` | Cloudflare token scoped to this account with Account → Cloudflare Pages → Edit                    |
| GitHub environment `production` | `CLOUDFLARE_API_TOKEN` | Cloudflare token with the same Pages permission; also used to read the deployed production commit |

Allow `main` in the `preview` environment's deployment branch rules. Allow
**both `main` and tags matching `v*`** in `production`: content updates use a
workflow on `main`, while code releases use tags. Required environment reviewers
will also gate automatic content updates; configure approvals deliberately.

Protect `main` with pull requests and the `Build` check. Protect release tags
against updates/deletion and restrict tag creation to release maintainers.
Only trusted preview builds receive the Sanity token. Published builds explicitly
set `SANITY_PREVIEW_TOKEN` to an empty string; fork PRs have no deployment path.
Cloudflare credentials are passed only to the steps that need them.

## Sanity webhooks

First merge the workflows into default branch `main`; GitHub dispatches require
the workflow to exist there. Two webhooks are already configured and disabled in
Sanity Manage → project `12mm2gbu` → API → Webhooks. Their source templates are:

- `.github/sanity-preview-webhook.json`: include drafts and published content,
  using event type `sanity-preview`.
- `.github/sanity-production-webhook.json`: published documents only,
  using event type `sanity-production`.

For each, enable create/update/delete. Put `rule.filter` in **Filter** and
`rule.projection` in **Projection**. Both exclude release versions and unrelated
document types. Preview also reacts to publishing/discarding drafts; production
explicitly excludes draft IDs. Do not send document contents to GitHub.

Both webhooks POST to:

```text
https://api.github.com/repos/onuralpbicer/beta-website-astro/dispatches
```

Add this custom header in Sanity (it is intentionally absent from the files):

```text
Authorization: Bearer <GitHub dispatch token>
```

Use a fine-grained GitHub token restricted to this repository with **Contents:
Read and write**, which the repository dispatch API requires. This is a separate
credential from the Sanity read token and the Cloudflare upload tokens. Store
it only in the webhook header configuration and rotate it before expiry. Sanity's
webhook signing Secret field is not a replacement for GitHub authentication.
The templates already include the Accept and Content-Type headers.

After configuring authentication, enable both webhooks. HTTP 204 means GitHub
accepted an event, not that a deployment succeeded. Check the resulting Actions
run. Use the existing `GitHub draft preview` (`vSxD9UkxAtn40RLJ`) and
`GitHub production content` (`3sblcYesP5jdBLX0`) hooks rather than creating
duplicates. The production hook reuses the old `Publish webhook` ID; its old
Cloudflare destination has already been replaced.

## Debounce and concurrency

Both content event paths wait 60 seconds on a GitHub runner. Shared concurrency
groups cancel the previous waiting job when another event arrives. The wait
starts when a runner starts the job, so batching is approximate rather than an
exact timer from webhook receipt. Each event still creates a workflow run;
retries may create additional runs. Continuous editing can postpone completion.

Preview cancellation covers the wait and build job. Code pushes and manual
previews share that group but skip the wait. Uploads have a separate group with
in-progress cancellation disabled. Before upload, an API check skips a build
when a newer non-cancelled/non-skipped preview request exists. An upload already
in progress finishes; its replacement follows. If the newest build fails, the
previous deployed preview remains. Start a fresh manual run to retry: rerunning
an old run can be skipped when newer requests exist.

Production cancellation covers only the debounce job. After that, the content
rebuild holds the **same production concurrency lock as tag uploads** throughout
commit resolution, building, and uploading. It reads Cloudflare's canonical
production deployment, validates its full commit SHA and ancestry on `main`,
and checks out that exact commit. It never promotes untagged `main` code.
Holding the lock prevents a content rebuild from overwriting a concurrent tag
release with older code. Production builds/uploads are not interrupted by new
events. Events arriving after a build starts can schedule a later rebuild.
Pending production jobs queue; reaching GitHub's queue limit requires a retry.

Builds fetch live Sanity content, so each static build is a snapshot rather than
an atomic transaction across CMS and Git changes. The latest published content
will be captured by the next successful content rebuild. There is no Worker,
Durable Object, or Pages deploy hook in the new build path.

## Code releases and rollback

After merging and passing `Build`:

```sh
git switch main
git pull --ff-only origin main
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

Only `vMAJOR.MINOR.PATCH` tags whose commits are reachable from `main` deploy.
Prerelease/leading-zero/malformed tags and unmerged commits fail validation.
Use an unused version for each release. `CI` builds the tag and its production
job uploads the same artifact, retained for seven days. Tags/GitHub Releases are
not created automatically. Preview artifacts are retained for three days.

Production content updates rebuild the deployed commit with fresh published
content and do not create tags. Commits predating the pnpm pin use pnpm 10.33.0;
newer commits use their own `packageManager` pin. Content-job retries rebuild
and refetch content. Tag deployment-job retries reuse their retained artifact;
rerunning the build refetches content.

Use Cloudflare Pages rollback to restore an existing deployment's code and
static content snapshot. The next content event rebuilds that rolled-back code
with current published content. Start a manual content rebuild after a rollback
if that is desired. A production deployment without a successful canonical
deployment, full commit SHA, or a commit reachable from `main` fails closed;
deploy a valid tagged release first.

## Activation, cleanup and verification

Configure secrets, merge/push the files, and run a manual preview and production
content rebuild before enabling their Sanity webhooks. Then make several quick
draft changes and verify cancelled waiting/build jobs followed by a fresh preview.
Verify a normal published change triggers the production content workflow and
keeps the production code commit unchanged. Live CMS testing changes external
content; use an agreed test edit rather than creating a release tag just to test.

The old Cloudflare Git build integration, production/preview deploy hooks,
Pages build command/cache configuration, and Pages-side preview token are
unnecessary after this migration. Preserve the existing Pages project,
deployments and domains. Removing old build configuration leaves existing
deployments hosted, but new builds need the GitHub workflows and secrets.
Remote cleanup results are recorded below; local files alone do not activate
workflows or webhooks.

Run `pnpm install --frozen-lockfile`, workflow linting, and both draft and
published builds. Use `SANITY_PREVIEW_TOKEN='' pnpm build` for published output;
a normal local build uses `.env` for draft verification. Builds need network
access to Sanity. The repository has no lint/type-check/test package scripts.
Local checks cannot verify GitHub scheduling, cancellation, or webhook delivery.

### Verified setup status — 11 November 2026

- Removed the local `workers/sanity-preview/` implementation, tests and config.
  No Worker was deployed, and the account's Worker script inventory was empty.
- Removed the `production` and `preview` deploy hooks from Pages project
  `beta-website`; verified its deploy-hook list is empty.
- Disconnected that project's Git repository integration, cleared its build
  command/output/root settings, disabled build caching, and removed its
  Pages-side `SANITY_PREVIEW_TOKEN`.
- Verified the production label remains `production`, all existing domains
  remain attached, and canonical deployment
  `3946e55c-9456-4411-9512-2058ae8d7078` is unchanged.
- Configured both Sanity GitHub webhooks above, verified the draft/published
  settings and event projections, and left them disabled without Authorization
  headers. The user must supply the dispatch token and enable them after Actions
  is ready.
- Preserved the separate `beta-website-dev` Pages project and account-wide
  GitHub app installation; this migration only removed `beta-website`'s source
  integration.
- Draft and published builds each generated 82 pages. The preview read token
  was absent from all 441 draft build output files checked. Installation with
  the frozen lockfile, formatting, release/ancestry guards, webhook filter and
  payload checks, preview freshness checks, and production-commit resolution
  checks passed. Sanity type generation ran; unrelated generated registry
  boilerplate was restored to baseline.
- Workflow linting passed with the narrow exemption below. `actionlint` 1.7.12
  predates GitHub's documented `concurrency.queue` property; `queue: max` was
  checked separately for both jobs sharing the production lock:

  ```sh
  actionlint -ignore 'unexpected key "queue" for "concurrency" section' .github/workflows/*.yml
  ```

GitHub secrets, environment restrictions, branch/tag rulesets and live workflow
execution are not configured or verified by this change. Files remain local
until committed and pushed. Existing deployments remain hosted, but the old
Cloudflare build path is now retired: configure GitHub before expecting new
builds. Live webhook burst/cancellation behavior and end-to-end uploads still
require activation testing.

References: [GitHub concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency),
[GitHub dispatch authentication](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event),
[Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks),
[Cloudflare CI uploads](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
