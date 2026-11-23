# Food Mechanix Nepal — launch package

This package is prepared for **GitHub Pages**, using HTML, CSS and JavaScript. The public site has no server, database or browser API keys. GitHub Actions runs the JavaScript importer and static page builder every six hours.

**Public editorial email:** foodmechanixnepal@gmail.com

## 1. Upload and publish

1. Extract this ZIP on your computer. **Upload its contents, not the ZIP and not an enclosing folder.** The repository root must contain `index.html`, `package.json`, `assets`, `data`, `scripts` and `.github`.
2. Create or open your GitHub repository. The workflow assumes the default branch is **main**. If it is named differently, change both `branches: [main]` and the checkout/push branch values in `.github/workflows/news-and-pages.yml`.
3. For a new project, use GitHub Desktop to upload the full extracted contents; it preserves the `.github` folder. If using GitHub’s web uploader, check that `.github/workflows/news-and-pages.yml` exists after upload. If missing, choose **Add file → Create new file**, enter that complete path, paste the supplied YAML file, and commit.
4. Choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Under **Settings → Actions → General → Workflow permissions**, permit **Read and write permissions** if repository policy requires it. The workflow needs to commit new articles. Organization rules or protected branches can prohibit direct bot pushes; use a repository/branch where this workflow is allowed, rather than disabling protections on an unrelated project.
6. Open **Actions → FMN Newsroom — Update and Publish → Run workflow**, choose `update`, and run it on `main`.
7. Open the completed run. The build job must pass and the deployment must succeed. The deployed URL is shown in the deployment step and **Settings → Pages**. Open that exact URL.

**You do not need a paid API key for news imports.** Public repositories can use GitHub Pages on GitHub Free, subject to GitHub’s current account rules and usage limits. This ZIP does not create or configure your GitHub repository for you.

GitHub’s reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 2. Before announcing the URL

Open the deployed homepage, one article, Nepal Focus, Global News, search, and the contact page. Check the same pages on a phone. Confirm the displayed email is correct and send a test email yourself if you want to check the mailbox. A working email link does not verify mailbox delivery.

Check the update status strip and original publication dates. The first import should be recorded in the workflow run summary. Retain your own domain only after you configure it under Settings → Pages; no domain ownership or DNS has been assumed.

## 3. Automatic news updates

Schedule: **00:17, 06:17, 12:17, 18:17 UTC**, which is **06:02, 12:02, 18:02, 00:02 Nepal time**. The last Nepal time falls on the following local day. GitHub can delay scheduled runs. Check the Actions tab if updates stop; GitHub may disable schedules after extended repository inactivity.

Sources: The Kathmandu Post, OnlineKhabar English, FoodNavigator, Food Safety News, and US FDA Food Recalls. A response must contain usable RSS/Atom items; an HTTP 200 error page or empty feed is reported as a failure.

- Source URLs, publisher names and original dates are retained.
- Kathmandu Post dates can be read from an explicit dated article URL when its feed omits dates. We do not invent a publication time.
- General news feeds must mention a food topic in the headline; passing agriculture references in political coverage do not qualify.
- Duplicate tracked links are normalized. Sources are interleaved so world feeds cannot fill the whole run before Nepal is processed.
- Up to 60 new/queued entries are processed per run. Newly imported items must be within 35 days; published briefs are retained for up to 180 days, capped at 200 items.
- Sensitive third-party claims are queued for review. Official FDA notices are marked **United States** and are not represented as Nepal-specific alerts.
- A failed feed does not erase saved news. Partial failures create warnings. A total outage still deploys the last valid edition and outage status, then marks the workflow failed.
- Status shows when feeds were checked, not when facts were independently verified. Stories remain source-attributed briefs.

## 4. Approve, reject or withdraw a story

Only someone with GitHub repository permissions can run these actions; there is no exposed website admin password or fake sign-in form.

1. Open a news import run’s **Summary**. Pending IDs, titles and source links are listed there. You can also open `data/review.json` in the repository.
2. Read the original report. Check the claim, date, country and summary.
3. Click **Run workflow**, choose `approve` or `reject` under `task`, and paste the exact `feed-...` ID into `story_id`.
4. Run it. Approval publishes that brief and rebuilds the site. Rejection records the decision so the URL is not imported again.
5. To withdraw an already published brief, choose `unpublish` with its ID from `data/articles.json`.

`deploy` rebuilds without fetching feeds or changing editorial decisions. `update` fetches new items. These choices do not accept arbitrary shell commands.

**Public repository note:** `review.json`, held starters and editorial decisions are excluded from the deployed website, but they are visible in a public GitHub repository and its history. Do not put confidential notes, private correspondence, credentials or personal information in these files. GitHub Pages is not a private newsroom CMS.

## 5. Photos and article length

The bundled images are four original **AI-generated food illustrations**, clearly labeled. They are not photographs of the reported events. Using them avoids falsely presenting a generic picture as evidence of an event. This package does **not** copy publishers’ photographs without permission.

For a photo you own or are licensed to publish:

1. Put an optimized WebP/JPEG/PNG in `assets/images/`.
2. Set the article’s `image` to its local path, `imageType` to `photo`, `imageCredit` to the proper caption/credit, and `imageLicense` to your ownership or license record.
3. Commit and deploy. The builder validates that the local file exists and a photo license record is present; this is not a legal verification of your license.

Articles are short attributed briefs linked to full reporting at the publisher. The importer does not fabricate additional paragraphs or copy full copyrighted reports to make a brief appear longer. For your own original reporting, edit the `summary` with factual original copy and retain accurate attribution.

## 6. Change contact details

Edit `data/site.json` → `email`, commit, and run `deploy`. The builder updates public page email links and article correction links from this one setting. The site title and visual branding are in the HTML templates and CSS. Update the importer’s RSS contact user-agent separately if the organization’s mailbox changes.

## 7. Optional NVIDIA summaries

RSS imports work without NVIDIA. To enable optional AI:

- Add `NVIDIA_API_KEY` as an **Actions repository secret**.
- Add `NVIDIA_MODEL` as an **Actions repository variable**, using an exact model identifier currently available to your NVIDIA account.
- Run `update`. No guessed/default model name is hard-coded. A maximum of eight requests is attempted per import run, and failed AI requests retain the source excerpt.

Never put an API key in HTML, JavaScript assets, JSON, the repository or chat. AI summarizes the supplied RSS excerpt; it does not independently fact-check. Official health notices retain their source excerpt.

## 8. Local development

Install Node.js **22 or newer** from https://nodejs.org. No npm dependencies are required.

In the extracted folder:

```sh
npm test
npm run update
npm run build
npm run preview
```

Open **http://localhost:8000/**. Stop the preview with Ctrl+C. Do not double-click `index.html`: browsers restrict JSON fetching from local files. The preview server is for local development only; GitHub serves the production site.

`npm run build` produces `_site`. The GitHub workflow uploads **only `_site`**, not scripts, review queues or documentation. It generates the policy pages, static story URLs, no-JavaScript archive and RSS. The deployment workflow passes the real Pages URL to create canonical links and a sitemap that include your repository path. Local builds without `SITE_URL` omit production canonical URLs and sitemap, rather than inventing a domain.

## 9. Files

- `index.html`, `article.html`: source templates.
- `assets`: public styling, client JavaScript, logo and illustrative images.
- `data/articles.json`: published briefs.
- `data/status.json`: real feed-check state.
- `data/site.json`: public email configuration.
- `data/review.json`: pending stories.
- `data/decisions.json`: approve/reject/unpublish audit and suppression URLs.
- `data/held-starters.json`: five original starter entries that could not initially be reverified. They are not published from this file. Some may independently be reimported from current RSS with actual source data.
- `scripts/update-news.mjs`: RSS importer.
- `scripts/moderate.mjs`: editorial actions.
- `scripts/build.mjs`: validation and static site generation.
- `scripts/serve.mjs`: local-only preview server.
- `scripts/*.test.mjs`: regression tests.
- `qa/dom-check.cjs`: optional client DOM checks (see VALIDATION.md).
- `.github/workflows/news-and-pages.yml`: updates, moderation, build and deployment.
- `VALIDATION.md`: checks performed and remaining deployment checks.

## Troubleshooting

**Action cannot find scripts:** repository files are inside an extra folder. Move the extracted contents to the root.

**No workflow appears:** `.github/workflows/news-and-pages.yml` was not uploaded, Actions is disabled, or the repository default branch is not the configured `main`.

**Push denied:** workflow write permissions or branch rules do not allow the bot commit. No deployment is reported as successful if that save step fails.

**Pages fails:** check Source = GitHub Actions and the `github-pages` environment’s branch rules. Use the actual failure message in the run log.

**Old news:** inspect `data/status.json`, the status strip and the last workflow run. A successful HTTP request is not sufficient if the feed is empty or unparsable.

**Broken original link:** publisher links can move. Correct or withdraw the entry; the importer validates publisher domains but cannot guarantee permanent publisher availability.

**Missing article:** new static pages appear after a successful build/deployment. Original query links `article.html?id=...` remain supported for existing bookmarks.

**Preview fails:** use Node 22+ and build first. No browser automation or paid service is required to run the website.
