#!/usr/bin/env node
/**
 * Save the public official catalogue and its unmodified page data for review.
 * Run: node scripts/fetch-ipas-catalog.mjs --output-dir /tmp/ipas-catalog-review
 * This does not overwrite catalog/data/certifications.json: subject types and
 * elective combinations must be checked against the linked annual PDFs first.
 * No account, cookie, API credential, or browser session is used.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const args = process.argv.slice(2);
const arg = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
if (args.includes('--help')) {
  console.log('Usage: node scripts/fetch-ipas-catalog.mjs --output-dir <directory> [--from-snapshot <directory>]');
  process.exit(0);
}
const outputDir = resolve(arg('--output-dir') || '/tmp/ipas-catalog-review');
const snapshotDir = arg('--from-snapshot');
const sourceUrl = 'https://ipd.nat.gov.tw/ipas/';
await mkdir(outputDir, { recursive: true });

// Next.js Flight can place a JSON record immediately after a length-prefixed T
// record. Splitting only at newlines silently loses EVM/NZ exam data. Locate and
// read the actual JSON property instead; never evaluate code from a web page.
export function decodeFlight(html) {
  let flight = '';
  for (const [, body] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!body.startsWith('self.__next_f.push(')) continue;
    const payload = JSON.parse(body.slice(body.indexOf('(') + 1, body.lastIndexOf(')')));
    if (payload[0] === 1 && typeof payload[1] === 'string') flight += payload[1];
  }
  return flight;
}

export function readProperty(text, key) {
  const marker = JSON.stringify(key) + ':';
  let start = text.indexOf(marker);
  if (start < 0) throw new Error(`Missing official property: ${key}`);
  start += marker.length;
  while (/\s/.test(text[start])) start++;
  if (!['[', '{'].includes(text[start])) throw new Error(`Unexpected value for ${key}`);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      if (--depth === 0) return JSON.parse(text.slice(start, i + 1));
    }
  }
  throw new Error(`Unterminated official property: ${key}`);
}

async function fetchPage(url, filename) {
  if (snapshotDir) return readFile(resolve(snapshotDir, filename), 'utf8');
  // curl follows the government's public-domain redirects and uses the host
  // certificate store. TLS verification is never disabled.
  const { stdout } = await run('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '45', encodeURI(url)], { maxBuffer: 20_000_000 });
  await writeFile(resolve(outputDir, filename), stdout);
  return stdout;
}

const homeHtml = await fetchPage(sourceUrl, 'home.html');
const categories = readProperty(decodeFlight(homeHtml), 'certifications');
if (!Array.isArray(categories) || !categories.every(x => Array.isArray(x.items))) {
  throw new Error('The official home catalogue format has changed; inspect the snapshot.');
}
const tasks = categories.flatMap(category => category.items.map(item => ({ category: category.name, ...item })));
const certifications = [];
const failures = [];
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < tasks.length) {
    const item = tasks[next++];
    const cert = { officialCode: item.code, name: item.name, category: item.category, homepageEntry: item, pages: {} };
    if (item.url) {
      // The central site delegates the brand planner to a different operator.
      cert.externalUrl = item.url;
      if (new URL(item.url).hostname === 'aoc-ipas.org.tw') {
        for (const [page, url] of Object.entries({
          home: item.url,
          'exam-info': 'https://aoc-ipas.org.tw/web/assessment/exam_brochure.jsp',
          'learning-resources': 'https://aoc-ipas.org.tw/web/assessment/exam_questions.jsp',
          schedule: 'https://aoc-ipas.org.tw/web/assessment/exam_schedule.jsp',
        })) {
          try {
            const filename = `${item.code}-${page}.html`;
            await fetchPage(url, filename);
            cert.pages[page] = { url, filename, requiresManualReview: true };
          } catch (error) { failures.push({ code: item.code, page, url, message: error.message }); }
        }
      }
    } else {
      for (const [page, property] of Object.entries({ 'exam-info': 'exam', 'learning-resources': 'resource', downloads: 'attachment' })) {
        const url = `${sourceUrl}certification/${encodeURIComponent(item.code)}/${page}`;
        try {
          const html = await fetchPage(url, `${item.code}-${page}.html`);
          cert.pages[page] = { url, data: readProperty(decodeFlight(html), property) };
        } catch (error) { failures.push({ code: item.code, page, url, message: error.message }); }
      }
    }
    certifications.push(cert);
    console.log(`${item.code}: ${Object.keys(cert.pages).length} official pages`);
  }
}));

// Keep the official home order in the output despite parallel downloads.
certifications.sort((a, b) => tasks.findIndex(x => x.code === a.officialCode) - tasks.findIndex(x => x.code === b.officialCode));
const result = { fetchedAt: new Date().toISOString(), sourceUrl, categories, certifications, failures };
await writeFile(resolve(outputDir, 'official-catalog-snapshot.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`Saved ${certifications.length} catalogue entries; ${failures.length} failed pages. Review annual PDFs before publishing changes.`);
if (failures.length) process.exitCode = 1;
