#!/usr/bin/env node
/**
 * npm run lock
 *
 * Encrypts the secret Instagram account behind the answers to her own puzzles and prints
 * a blob to paste into `secretPayload` in birthday.config.js.
 *
 * Why bother: by default the handle sits in the config in plain text, which means it also
 * sits in the built JavaScript. She is a programmer. If there's any chance she pokes at
 * the source before finishing, this closes that door — the payload genuinely cannot be
 * decrypted without the six correct answers.
 *
 * Run it again any time you change a puzzle answer, since the answers *are* the key.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { BIRTHDAY_CONFIG } from '../src/birthday.config.js';
import { deriveKey, encryptSecret, decryptSecret } from '../src/lib/secret.js';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(here, '../src/birthday.config.js');

const dim = (text) => `[2m${text}[0m`;
const pink = (text) => `[38;5;211m${text}[0m`;
const green = (text) => `[32m${text}[0m`;
const bold = (text) => `[1m${text}[0m`;

/** `--username x --url y`, for running this non-interactively. */
function readFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const match = /^--(username|url)(?:=(.*))?$/.exec(argv[i]);
    if (!match) continue;
    flags[match[1]] = match[2] ?? argv[i + 1] ?? '';
  }
  return flags;
}

/**
 * Collects the two values.
 *
 * Prompts when there's a real terminal. Falls back to reading piped stdin, because
 * `readline`'s question() simply never resolves once the input stream hits EOF — which
 * would hang the script silently for anyone scripting it.
 */
async function collect(currentUser, currentUrl) {
  const flags = readFlags(process.argv.slice(2));
  if (flags.username || flags.url) {
    return {
      username: (flags.username || currentUser).trim(),
      url: (flags.url || currentUrl).trim(),
    };
  }

  if (!stdin.isTTY) {
    let piped = '';
    for await (const chunk of stdin) piped += chunk;
    const [username = '', url = ''] = piped.split(/\r?\n/);
    return {
      username: username.trim() || currentUser,
      url: url.trim() || currentUrl,
    };
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const username =
    (await rl.question(`  Instagram username ${dim(`[${currentUser}]`)}: `)).trim() || currentUser;
  const url = (await rl.question(`  Instagram URL ${dim(`[${currentUrl}]`)}: `)).trim() || currentUrl;
  rl.close();
  return { username, url };
}

async function main() {
  console.log('');
  console.log(pink(bold('  HER v21.0 — lock the secret')));
  console.log(dim('  Encrypts the Instagram account behind her six puzzle answers.'));
  console.log('');

  const currentUser = BIRTHDAY_CONFIG.secretInstagramUsername ?? '';
  const currentUrl = BIRTHDAY_CONFIG.secretInstagramUrl ?? '';

  const { username, url } = await collect(currentUser, currentUrl);

  if (!username || !url) {
    console.error('\n  Both a username and a URL are required.\n');
    process.exit(1);
  }

  const key = deriveKey(BIRTHDAY_CONFIG);
  const payload = encryptSecret({ username, url }, key);

  /* Never hand over a payload without proving it opens again. */
  const check = decryptSecret(payload, key);
  if (!check || check.username !== username || check.url !== url) {
    console.error('\n  Round-trip check failed — not writing anything. Please report this.\n');
    process.exit(1);
  }

  console.log('');
  console.log(dim('  Key derived from:'));
  key.split('|').forEach((part, index) => {
    console.log(dim(`    ${index + 1}. ${part}`));
  });
  console.log('');

  /* Patch the config in place: set secretPayload, blank the plain-text fields. */
  const source = readFileSync(configPath, 'utf8');
  let next = source.replace(
    /(\n\s*secretPayload:\s*)(null|'[^']*'|"[^"]*")/,
    `$1'${payload}'`,
  );

  if (next === source) {
    console.log('  Could not find `secretPayload` in the config. Paste this in by hand:\n');
    console.log(`  secretPayload: '${payload}',\n`);
    process.exit(0);
  }

  next = next
    .replace(/(\n\s*secretInstagramUsername:\s*)'[^']*'/, "$1''")
    .replace(/(\n\s*secretInstagramUrl:\s*)'[^']*'/, "$1''");

  writeFileSync(configPath, next, 'utf8');

  console.log(green('  ✓ Locked.'));
  console.log(dim('    secretPayload written to src/birthday.config.js'));
  console.log(dim('    plain-text username and URL cleared'));
  console.log('');
  console.log(dim('  Re-run this after changing any puzzle answer, or the payload'));
  console.log(dim('  will no longer match and the reveal will warn you.'));
  console.log('');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
