import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { initializePosts } from './post-templates.mjs';

const args = process.argv.slice(2);
if (args.includes('--write') || args.includes('-w')) initializePosts();
const result = spawnSync(
  process.execPath,
  [fileURLToPath(new URL('../node_modules/prettier/bin/prettier.cjs', import.meta.url)), ...args],
  {
    stdio: 'inherit',
  }
);
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
