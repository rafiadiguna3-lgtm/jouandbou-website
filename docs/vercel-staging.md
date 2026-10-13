# Vercel staging: setup and review

This branch is prepared for **Preview staging only**. It is not production-ready:
15 source images are still pending, and there is no verified Vercel deployment yet.
Do not merge the Draft PR, connect a domain, or change the existing websites.

## What is already prepared

- `vercel.json`: Framework **Other** (no framework), install `npm ci`, build
  `npm run build:vercel`, output `dist`.
- Node.js **24.x** is pinned in `package.json` and the lockfile.
- Production builds explicitly fail in `scripts/vercel-build.mjs` when Vercel
  identifies the environment as `production`.
- Automatic Git deployments are disabled, so branch updates do not automatically
  publish new deployments. Staging uploads are an explicit Preview action.
- Responses use `X-Robots-Tag: noindex, nofollow`. This discourages indexing;
  it is not password protection. Keep Vercel's own access protection as needed.
- `.vercelignore` excludes local dependencies, duplicate `dist/`, test reports,
  screenshots and local environment files from source uploads. The source
  manifest required by the build remains included.
- All 885 existing frontend files remain unchanged, including the 15 empty images.

## Steps for a non-technical user

Use this one-time command setup to create a project without the dashboard's
initial Production deployment. All website browsing/review happens in Vercel
once the Preview exists. Commands below upload only to a new Vercel project.

1. Sign in or create an account at https://vercel.com. Install **Node.js 24 LTS**
   from https://nodejs.org if it is not already installed. No tokens need to be
   pasted into chat.
2. Open the repository's migration branch:
   https://github.com/rafiadiguna3-lgtm/jouandbou-website/tree/migration/jou-and-bou
   Confirm the branch selector says **migration/jou-and-bou**. Click the green
   **Code** button, then **Download ZIP**, and extract it. Do not download `main`.
3. Open a terminal **inside the extracted folder containing `package.json` and
   `vercel.json`**. On Windows, right-click in the folder and choose **Open in
   Terminal**. On macOS, open Terminal, type `cd ` (including the space), drag
   that folder into the Terminal window, and press Enter.
4. Paste this command and press Enter:

   ```sh
   npx vercel@63.1.2 login
   ```

   If asked whether to install Vercel, type `y`. Follow the browser login steps.
   Return to Terminal once login succeeds.
5. Paste:

   ```sh
   npx vercel@63.1.2 link
   ```

   Choose your account/team. Choose **Create new project** rather than linking
   an existing site. Use the name **jou-and-bou-staging** (a unique suffix is fine
   if already taken). Keep the project directory as `./`—the folder containing
   `package.json`. If asked to connect a Git repository, decline for this initial
   manual staging setup. If you see a settings override prompt, keep the local
   `vercel.json` values listed below. This links a project; it does not deploy it.
6. In the Vercel dashboard, open **jou-and-bou-staging → Settings → Build and
   Deployment**. Confirm these values, saving any changes:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Other |
   | Root Directory | Project root; leave blank rather than entering `site` or `dist` |
   | Node.js Version | 24.x |
   | Install Command | `npm ci` |
   | Build Command | `npm run build:vercel` |
   | Output Directory | `dist` |

   No application environment variables or API keys are needed. Keep Deployment
   Protection enabled if you want staging access limited to your account/team.
   Do not add `jouandbou.com` or any other custom domain in **Domains**.
7. Return to the same Terminal folder and paste:

   ```sh
   npx vercel@63.1.2 deploy --target=preview
   ```

   Wait for completion. Open the printed Vercel deployment link. In the dashboard
   **Deployments** tab, confirm **Environment: Preview** and **Status: Ready**.
   A generated `*.vercel.app` Preview hostname is expected. Do not use `--prod`,
   **Promote to Production**, or add a custom domain. If Vercel shows a Production
   build error from our guard, select Preview rather than changing the guard.
8. Open **Build Logs** for that Preview. Look for the completed build message
   `Built 885 source and asset files into dist/`. Then click **Visit**. Send the
   ordinary Preview URL (without access-token query parameters) back in this chat
   so hosted verification can continue.

This ZIP/manual workflow does not merge the GitHub branch or change either
existing website. For a later revision, use the latest ZIP from the same branch,
link it to the same staging project, and deploy with `--target=preview` again.

## What to check in the Preview

- Home: the architectural neighborhood appears. Drag to explore and zoom.
  Search for **Marboy**, enter 3D (on a phone, tap the roof callout after the search
  result), rotate/zoom the house, then open **Project details**.
- Project details: Marboy, Rumah Anas, Rumahsoka, Jangkrik, Flute, Rumah Zubair,
  RR House, Rempoa and the construction projects open/close as before. Video
  playback and the photograph viewer should work where original assets exist.
- Phone: open the menu, switch between projects/about/contact, and rotate the
  phone into landscape. Expect the same published layouts and animations.
- Fonts: **About us** uses the original Lato/Open Sans declarations. Visual
  appearance alone cannot prove fonts loaded; the automated staging test below
  checks the stylesheet, font binaries and browser font state.
- Contact: map tiles should actually appear behind the studio marker. Click the
  studio chip to open contact information. A contact card without map tiles is
  not a successful tile-loading check.
- The known 15 missing photos may still be blank/broken. Their exact filenames
  remain in `migration-status.md`; no substitutes have been inserted.

## Automated hosted verification

After the Preview URL exists, the prepared suite checks the deployed HTML/module
responses, noindex header and genuine missing-asset 404s, then actual 3D gestures,
project detail routes, Google Fonts loading and map tile responses.

```sh
STAGING_URL=https://YOUR-PREVIEW.vercel.app npm run test:staging
```

This command is for a developer or this assistant; the manual checks above need
no programming. The suite accepts HTTPS `*.vercel.app` only, preventing accidental
checks against the main domain. It does not create or deploy a Vercel project.

If Deployment Protection prevents automated access, keep it enabled. A Vercel
**Protection Bypass for Automation** secret can be supplied securely as
`VERCEL_AUTOMATION_BYPASS_SECRET` in the test environment; do not paste it into
chat, source files, screenshots or PR comments. The tests send it only to the
specified Preview origin, never Google Fonts or map hosts. The ordinary Preview
URL is not a credential. The cloud network must also allow that exact hostname
and the original font/map destinations.

## Validation and remaining issues

- Official `@vercel/static-build@20.0.1` builder: **passed locally** with the real
  `npm ci` and `npm run build:vercel` commands. It returned all 885 frontend files;
  each matches the original source hash. See `vercel-build-validation.json`.
  This is evidence of builder compatibility, **not a hosted Vercel build result**.
- Production guard/config tests: **2 passed**.
- Existing local browser regression tests: **4 passed**.
- Hosted staging suite: **not run**; no Preview URL exists. Running without
  `STAGING_URL` exits with an explicit error instead of claiming a passing run.
- Asset completeness remains **failed/pending** because the original 15 files
  are empty. No production-ready claim is made.
- No Vercel credentials/project binding exist in the cloud environment. The
  unauthenticated CLI inspection required login; its attempted login endpoint
  request failed. Vercel docs/schema HTTPS requests were blocked by the cloud
  network proxy. No remote deployment was created or build logs retrieved.
- The frontend is about **220 MiB** (230,386,036 bytes); videos/model geometry
  account for much of it. Vercel's plan/upload/static-file limits still need to be
  confirmed during the actual upload. If Vercel rejects the source size, record
  the full error and stop. Do not remove assets, simplify 3D, recompress media, or
  move content to another host without approval. A suitable plan or an approved
  asset-hosting change may be needed.
- Google Fonts and external map tiles remain pending hosted verification.
  No new integrations, custom domains, DNS edits, Squarespace edits, Sites edits,
  merge, or Production deployment were made.
