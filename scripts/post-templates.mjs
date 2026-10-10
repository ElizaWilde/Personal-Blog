import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function initializePosts(root = projectRoot) {
  const config = JSON.parse(readFileSync(join(root, 'post.config.json'), 'utf8'));
  const postRoot = join(root, 'src/data/post');
  if (!existsSync(postRoot)) return [];
  const initialized = [];
  const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
  const date = (value) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: config.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(value);
    const part = (type) => parts.find((item) => item.type === type).value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  };

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.isFile() || !['.md', '.mdx'].includes(extname(file).toLowerCase())) continue;
      const content = readFileSync(file, 'utf8');
      if (content.trim() && !/^\s*---\s*\r?\n\s*---\s*$/.test(content)) continue;
      const stats = statSync(file);
      const folder = basename(dirname(file));
      const category = dirname(file) === postRoot ? '' : (config.categoryByFolder?.[folder] ?? folder);
      const title = basename(file, extname(file));
      const template = [
        '---',
        `title: ${quote(title)}`,
        `publishDate: ${date(stats.birthtimeMs > 0 ? stats.birthtime : stats.mtime)}`,
        `updateDate: ${date(stats.mtime)}`,
        'draft: false',
        "excerpt: ''",
        `category: ${quote(category)}`,
        `author: ${quote(config.author)}`,
        'tags: []',
        'metadata: {}',
        '---',
        '',
      ].join('\n');
      // Recheck before writing so a file edited during the scan is left alone.
      if (readFileSync(file, 'utf8') !== content) continue;
      writeFileSync(file, template, 'utf8');
      initialized.push(file);
      console.log(`[posts] Created template: ${file}`);
    }
  }

  visit(postRoot);
  return initialized;
}

export function watchPosts(root = projectRoot) {
  const scan = () => {
    try {
      initializePosts(root);
    } catch (error) {
      console.error(`[posts] ${error.message}`);
    }
  };
  scan();
  // Polling also notices new nested directories on Windows and Docker bind mounts.
  const timer = setInterval(scan, 1000);
  console.log('[posts] Watching for empty Markdown posts.');
  return () => clearInterval(timer);
}

export default function postTemplates() {
  return {
    name: 'post-templates',
    hooks: {
      'astro:config:setup': ({ command }) => {
        if (command === 'dev') initializePosts();
      },
      'astro:server:setup': ({ server }) => {
        const stop = watchPosts();
        server.httpServer?.once('close', stop);
      },
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--watch')) watchPosts();
  else initializePosts();
}
