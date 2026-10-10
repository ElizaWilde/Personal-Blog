import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import yaml from 'js-yaml';
import { initializePosts, watchPosts } from './post-templates.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'post-templates-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const folder = join(root, 'src/data/post');
  mkdirSync(folder, { recursive: true });
  const config = join(root, 'post.config.json');
  writeFileSync(config, JSON.stringify({ author: 'Eliza', timeZone: 'Asia/Singapore', categoryByFolder: {} }));
  return { root, folder, config };
}

function metadata(file) {
  return yaml.load(readFileSync(file, 'utf8').split('---')[1]);
}

test('fills blank posts and empty frontmatter, escapes YAML, and preserves existing articles', (t) => {
  const { root, folder, config } = fixture(t);
  const nested = join(folder, 'DevOps&Cloud');
  mkdirSync(nested);
  const file = join(nested, "Docker's notes.md");
  writeFileSync(file, '---\r\n---\r\n');
  const empty = join(folder, 'test.md');
  writeFileSync(empty, '');
  const existing = join(folder, 'existing.md');
  const content = '---\ntitle: Custom\nauthor: Other\n---\n\nMy article.\n';
  writeFileSync(existing, content);
  const bodyOnly = join(folder, 'body.md');
  writeFileSync(bodyOnly, '# Already writing\n');
  writeFileSync(
    config,
    JSON.stringify({
      author: "Eliza's pen",
      timeZone: 'Asia/Singapore',
      categoryByFolder: { 'DevOps&Cloud': 'DevOps/Cloud' },
    })
  );
  assert.equal(initializePosts(root).length, 2);
  const data = metadata(file);
  assert.equal(data.title, "Docker's notes");
  assert.equal(data.author, "Eliza's pen");
  assert.equal(data.category, 'DevOps/Cloud');
  assert.equal(data.draft, false);
  assert.ok(data.publishDate instanceof Date);
  assert.ok(data.updateDate instanceof Date);
  assert.equal(metadata(empty).category, '');
  assert.equal(readFileSync(existing, 'utf8'), content);
  assert.equal(readFileSync(bodyOnly, 'utf8'), '# Already writing\n');
  assert.equal(initializePosts(root).length, 0);
});

test('watcher discovers new directories and reads updated author configuration', async (t) => {
  const { root, folder, config } = fixture(t);
  const stop = watchPosts(root);
  t.after(stop);
  writeFileSync(config, JSON.stringify({ author: 'New Author', timeZone: 'Asia/Singapore' }));
  const nested = join(folder, 'New Category');
  mkdirSync(nested);
  const file = join(nested, 'New Post.md');
  writeFileSync(file, '');
  const deadline = Date.now() + 5000;
  while (!readFileSync(file, 'utf8') && Date.now() < deadline) {
    await new Promise((done) => setTimeout(done, 100));
  }
  assert.equal(metadata(file).author, 'New Author');
  assert.equal(metadata(file).category, 'New Category');
});
