import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const publicPaths = ['index.html', 'admin/index.html', 'assets', 'media'];
for (const app of ['junior', 'intermediate', 'bi']) {
  for (const entry of ['index.html', 'manifest.webmanifest', 'service-worker.js', 'assets', 'data']) {
    publicPaths.push(`${app}/${entry}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const relativePath of publicPaths) {
  const target = join(output, relativePath);
  await mkdir(join(target, '..'), { recursive: true });
  await cp(join(root, relativePath), target, {
    recursive: true,
    filter: source => !relative(root, source).split(/[\\/]/).some(part => part.startsWith('.')),
  });
}
console.log(`Prepared ${publicPaths.length} public entries in dist/.`);
