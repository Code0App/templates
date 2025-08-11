#!/usr/bin/env node
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`));
    });
  });
}

function findTemplates(root) {
  const entries = readdirSync(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => join(root, e.name))
    .filter((p) => {
      try {
        const dockerfile = statSync(join(p, 'e2b.Dockerfile'));
        const toml = statSync(join(p, 'e2b.toml'));
        return dockerfile.isFile() && toml.isFile();
      } catch {
        return false;
      }
    });
}

async function main() {
  const args = process.argv.slice(2);
  const modeIdx = args.indexOf('--mode');
  const mode = modeIdx >= 0 ? (args[modeIdx + 1] || '').toLowerCase() : '';

  // Determine base directory to scan for templates:
  // Priority: --dir <path> arg > TEMPLATES_DIR env > ./sandbox if exists > repo root (cwd)
  const cwd = join(process.cwd());
  const dirIdx = args.indexOf('--dir');
  const argDir = dirIdx >= 0 ? args[dirIdx + 1] : '';
  const envDir = process.env.TEMPLATES_DIR || '';
  const sandboxDirCandidate = join(cwd, 'sandbox');
  const baseDir = argDir
    ? join(cwd, argDir)
    : envDir
    ? join(cwd, envDir)
    : existsSync(sandboxDirCandidate)
    ? sandboxDirCandidate
    : cwd;

  const templates = findTemplates(baseDir);
  if (templates.length === 0) {
    console.error(`No templates found. Looked in: ${baseDir}/*`);
    process.exit(1);
  }

  console.log(`Scanning templates in: ${baseDir}`);
  console.log(`Found ${templates.length} template(s):`);
  for (const t of templates) console.log('-', t);

  for (const t of templates) {
    if (!mode || mode === 'build' || mode === 'all') {
      console.log(`\n=== Building: ${t} ===`);
      await run('e2b', ['template', 'build'], t);
    }
    if (!mode || mode === 'publish' || mode === 'all' || mode === '') {
      console.log(`\n=== Publishing: ${t} ===`);
      await run('e2b', ['template', 'publish'], t);
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
