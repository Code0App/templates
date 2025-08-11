# Code0 Sandbox Templates (standalone)

Standalone E2B sandbox templates used by the Code0 app to spin up ephemeral environments per project.

Once published, the app can create sandboxes in E2B Cloud (no local Docker required at runtime).

## Templates
- `nextjs-shadcn` — Next.js 15 + shadcn/ui baseline.
- `nextjs-radixui` — Next.js 15 + Radix UI baseline.

Each template folder contains:
- `e2b.Dockerfile` — how the template image is built.
- `e2b.toml` — template metadata (team, name/ID, CPU/RAM, start command).
- `compile_page.sh` — start script executed inside the sandbox at `/compile_page.sh`.

## Prerequisites
- E2B account + API key (`E2B_API_KEY`).
- E2B CLI (use `npx e2b@latest` or install globally with `npm i -g e2b`).
- Docker Desktop (for building/publishing templates).
- Node.js (to run scripts in this repo).

## Configure (env)
Set your API key before building/publishing:

PowerShell
```
$env:E2B_API_KEY = "<your_e2b_api_key>"
```

In the app that consumes templates, set one of (ID is preferred):
- `E2B_TEMPLATE_ID=<template_id>`
- or `E2B_TEMPLATE_NAME=<template_name>`
- or `E2B_TEMPLATE=<template_name>`

Sandbox names are typically derived from each project’s name.

## Build & publish (per template)
PowerShell examples:

Using npx (no global install):
```
$env:E2B_API_KEY = "<your_e2b_api_key>"
cd .\nextjs-shadcn\
npx e2b@latest template build
npx e2b@latest template publish

cd ..\nextjs-radixui\
npx e2b@latest template build
npx e2b@latest template publish
```

Or with global CLI:
```
npm i -g e2b
$env:E2B_API_KEY = "<your_e2b_api_key>"
cd .\nextjs-shadcn\ ; e2b template build ; e2b template publish
cd ..\nextjs-radixui\ ; e2b template build ; e2b template publish
```

After publishing, the CLI prints the `template_id`. Use that in your app `.env` as `E2B_TEMPLATE_ID`.

## Build & publish all templates (script)

This repo includes a helper script to build/publish every template under this folder:

```
node ./scripts/build-and-publish.mjs              # build + publish all
node ./scripts/build-and-publish.mjs --mode build # build only
node ./scripts/build-and-publish.mjs --mode publish # publish only
```

Requirements: E2B CLI available on PATH (use `npx e2b@latest` or global `e2b`). On Windows, the script spawns with shell support.

## Resource configuration
You can set CPU/RAM per template in `e2b.toml`:

```
cpu_count = 8
memory_mb = 8192
```

Or override at build time:

```
e2b template build --cpu-count 8 --memory-mb 8192
```

## Start command & script path
- `e2b.toml` sets: `start_cmd = "/compile_page.sh"`
- `e2b.Dockerfile` ensures the script exists and is executable:
  - `COPY compile_page.sh /compile_page.sh`
  - `RUN chmod +x /compile_page.sh`

Always use the absolute path (`/compile_page.sh`) and LF line endings inside the image.

## CI/CD (GitHub Actions example)
```
name: Publish E2B Templates
on:
  workflow_dispatch:
  push:
    branches: [ main ]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install E2B CLI
        run: npm i -g e2b
      - name: Build & Publish All Templates
        env:
          E2B_API_KEY: ${{ secrets.E2B_API_KEY }}
        run: |
          cd sandbox
          node ./scripts/build-and-publish.mjs
```

## Troubleshooting
- Docker daemon not running: start Docker Desktop; WSL2 & Linux containers enabled. Verify with `docker version` and `docker run hello-world`.
- Exit 127 / script not found: ensure `start_cmd` is absolute and the script has executable bit and LF line endings.
- Template 404: ensure the template exists in the correct E2B team and you’re using the right `template_id` or name.
- Nested app folder: both Dockerfiles build in `/tmp/app` and copy to `/home/user` to avoid `nextjs-app` nesting.

## Security & license
See `SECURITY.md` and `LICENSE`.