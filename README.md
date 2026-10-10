# Personal Blog

A personal blog and devlog for recording projects, bugs, fixes, notes, and progress updates.

## Maybe you want to use it

### How to deploy it locally

The easiest method is Docker Compose. From the project directory, run:

```powershell
docker compose up -d --build
```

Open [http://localhost:8080](http://localhost:8080).

After changing code or Markdown content, run the same command again to rebuild and update the container:

```powershell
docker compose up -d --build
```

If Docker continues to show an older cached version, rebuild without the cache:

```powershell
docker compose build --no-cache
docker compose up -d
```

Useful Docker commands:

```powershell
docker compose ps
docker compose logs -f astrowind
docker compose down
```

To run the project without Docker:

```powershell
npm install
npm run dev
```

The Astro development server normally opens at [http://localhost:4321](http://localhost:4321).

### Formatting before pushing

Start Docker Desktop, then fix formatting without installing Node.js or npm:

```powershell
docker compose run --rm --build formatter
```

Review and commit the formatting changes before pushing. To check without changing files:

```powershell
docker compose run --rm --build formatter --check .
```

Enable the formatting safeguard once per clone:

```powershell
git config core.hooksPath .githooks
```

The pre-push hook runs the Docker formatting check and blocks the push if it fails.
Docker must be running. The first run builds the dependency image; later runs reuse the cache.
Git hooks do not run for edits made directly on GitHub, so GitHub Actions still checks formatting.
Git and VS Code use LF line endings. Use the Docker formatter to match the version in the project lockfile; a different locally installed Prettier version can produce different formatting.

### How to add or remove root blocks and sub-blocks

All block definitions are in:

```text
src/config/blog-blocks.ts
```

#### Add an empty root block

Add an item to `BLOG_BLOCK_DEFINITIONS`:

```ts
{
  title: 'New-root',
  description: 'Description of the new root block.',
  children: [NEW_ROOT_SUB_BLOCKS],
},
```

Create the matching content directory:

```text
src/data/post/New-root/
```

The root page is generated automatically from its title.

#### Add a New-root sub-block

Add an item to `NEW_ROOT_SUB_BLOCKS`:

```ts
{
  title: 'Performance',
  description: 'performance testing.',
},
```

Create its content directory:

```text
src/data/post/New-root/Performance/
```

Posts in this block must use the exact title in their frontmatter:

```yaml
category: 'Performance'
```

The block page is generated automatically at `/category/performance`.

#### Remove a block

1. Remove its definition from `src/config/blog-blocks.ts`.
2. Reassign or remove posts that use the block's category.
3. Remove its content directory when it is empty.
4. Run `npm run build` to confirm no post uses an invalid category.

Do not remove a configured category while posts still reference it. The content schema requires every non-empty `category` value to match a configured sub-block title exactly.

### How to add, edit, move, or remove files in blocks

Posts are Markdown files stored recursively under:

```text
src/data/post/
```

#### Automatically initialize a new post

Start the post watcher before creating the file:

```powershell
npm run watch:posts
```

Keep that terminal running. When an empty `.md` file is created anywhere below `src/data/post`, the watcher automatically adds:

- `title`, based on the filename
- `publishDate`, using today's date
- `updateDate`, using today's date
- `category`, based on the immediate parent folder
- `draft: false`
- `author: 'Eliza'`
- the standard excerpt and metadata fields

For example, creating:

```text
src/data/post/Full-stack/API design/REST.md
```

sets:

```yaml
title: 'REST'
category: 'API design'
draft: false
author: 'Eliza'
```

The watcher only initializes empty new Markdown files. It does not overwrite files that already contain text. The correct directory is `src/data/post`, not `src/data/pos`.

The parent folder must represent a configured block. Existing folder aliases such as `DevOps&Cloud` and `Test` are normalized to the configured category names `DevOps/Cloud` and `Testing`.

For example:

```text
src/data/post/Full-stack/API design/API.md
```

This file is published at:

```text
/blog/full-stack/api-design/api
```

#### Add a post

Empty `.md` and `.mdx` files under `src/data/post` can receive a template automatically.
The watcher runs during `npm run dev`. VS Code also starts a Docker watcher when this folder opens
(Docker Desktop must be running; allow automatic workspace tasks if prompted).
To start it manually without Node.js:

```powershell
docker compose run --rm -T post-templates
```

Keep that command running while creating posts. It checks every second, including new nested folders.
Without Docker, use `npm run watch:posts`.
To initialize empty files once, use `npm run init:posts` or `docker compose run --rm formatter`.
The formatter's `--check` mode does not generate or modify posts.

Edit `post.config.json` to change the default `author` (initially `Eliza`), date `timeZone`,
or optional category folder aliases. Templates use the filename without its extension as `title`,
the file creation date as `publishDate`, its modification date as `updateDate`, `draft: false`,
and the immediate parent folder as `category`. Files directly inside `post` get an empty category.
`DevOps&Cloud` maps to the configured site category `DevOps/Cloud`.
Dates use `YYYY-MM-DD` in the configured timezone. Once written, metadata stays editable;
the watcher does not rewrite it or update dates on later edits.
Only empty files or files containing an empty `---` frontmatter block are initialized;
existing article content and metadata are preserved. Changing the default author affects future
templates and posts without an explicit author, not existing frontmatter.

Create a `.md` file in the appropriate block directory:

```md
---
title: 'REST API Design'
publishDate: 2026-09-21
updateDate: 2026-09-21
draft: false
excerpt: 'Notes about designing reliable REST APIs.'
category: 'API design'
author: 'Eliza'
tags: []
metadata: {}
---

Write the article here.
```

Important rules:

- Explicit metadata overrides the automatic defaults. Missing titles default to the filename.
- `category` must exactly match a configured sub-block title.
- Set `draft: true` to keep an unfinished post out of the generated website.
- Set `draft: false` when the post is ready to publish.
- Markdown `h2` and `h3` headings automatically appear in the article's table of contents.
- Every Markdown file must end with a newline so the Prettier check passes.

#### Move or rename a post

Move or rename the Markdown file, then rebuild the site. Because the relative file path is used in the post URL, moving or renaming a file changes its URL.

Update the post's `category` if it moves to a different sub-block.

#### Remove a post

Delete its Markdown file and rebuild the site:

```powershell
npm run build
```

#### Validate changes before committing

```powershell
npx prettier --write "src/data/post/path/to/post.md"
npm run check
npm run build
```
