# Launch validation — 23 November 2026

## Checks completed

- All **23 automated tests pass**, covering RSS and Atom parsing, encoded text, dated publisher URLs, trusted hosts, food-topic filtering, future dates, review routing, official jurisdiction, feed failures, duplicate prevention, approval/rejection/withdrawal, corrupt-data preservation, retention, image validation and static project-path builds.
- A live import returned usable items from all **five configured sources**. The delivered edition contains **35 published briefs**, plus **10 pending entries** excluded from the public build. Four retained starter source pages were read during preparation; five initially unverifiable starter entries were held separately. Feed availability and article counts will change after new imports.
- Client DOM checks pass for homepage rendering, distinct lead/sidebar/latest story links, region navigation highlights, search and escaped input, pagination, article source links, sharing fallback, legacy query links, missing stories, saved-edition fallback, menu/Escape behavior and contact content.
- The static build generated **42 HTML pages**: 35 articles and seven site/utility pages. Internal links and asset paths resolve. RSS XML and workflow YAML parse. The canonical/sitemap build test covers a repository subpath.
- The deployed output excludes scripts, pending queues, held starters and editorial decisions. Those files are still visible in a public source repository.

## Reproduce checks

No dependencies are needed for the main tests or build:

```sh
npm test
npm run build
```

The optional DOM checks use jsdom, a test-only dependency. It is not loaded by the website or required by the deployment workflow:

```sh
npm install --no-save --package-lock=false jsdom
node qa/dom-check.cjs
```

## Checks that need your deployed site

A visual browser preview could not be completed in this execution environment. Chromium launch was restricted; the separate browser could not reach the local preview. DOM checks do not prove visual rendering or phone layout quality.

After GitHub Pages is configured, check desktop and phone layouts, keyboard navigation, all category pages, an article, email links and the first scheduled update. The six-hour workflow, repository write permission, GitHub environment rules, live URL, custom domain and actual mailbox delivery cannot be confirmed from this ZIP alone. No repository was uploaded or public website deployed during preparation.

The site uses four labeled AI-generated illustrative images and short source-attributed briefs. It does not include copied publisher photographs or full publisher articles. These are stated product boundaries, not claims that original news photography or independent reporting has been supplied.
