# Sandbox templates

This folder contains E2B sandbox templates used by the app to spin up ephemeral environments for each project.

## Structure
- `nextjs/`
  - `e2b.Dockerfile` — Docker build for the template image
  - `e2b.toml` — Template metadata (team, name/ID, start command)
  - `compile_page.sh` — Start script executed inside the sandbox (path: `/compile_page.sh`)

## Requirements
- E2B account + API key (E2B_API_KEY)
- Docker Desktop (only needed to build/publish templates)
- Node.js (to run the E2B CLI via npx or global install)

Once a template is published, the app can create sandboxes from E2B Cloud without Docker running locally.

## Configure env (root .env)
Set one of (ID is preferred):
- `E2B_TEMPLATE_ID=<template_id>`
- or `E2B_TEMPLATE_NAME=<template_name>`
- or `E2B_TEMPLATE=<template_name>`
Also set `E2B_API_KEY=<your_key>`.

Sandbox names are derived from each project’s name automatically.

## Build & publish
Windows PowerShell examples:

- Using npx (no install):
```
$env:E2B_API_KEY = "<your_e2b_api_key>"
cd sandbox\nextjs
npx e2b@latest template build
npx e2b@latest templates publish
```

- Or global install:
```
npm i -g e2b
$env:E2B_API_KEY = "<your_e2b_api_key>"
cd sandbox\nextjs
e2b template build
e2b templates publish
```
After publishing, copy the `template_id` from the CLI output and put it in `.env` as `E2B_TEMPLATE_ID`.

## Start command & script path
- `e2b.toml`: `start_cmd = "/compile_page.sh"`
- `e2b.Dockerfile` copies and makes it executable:
  - `COPY compile_page.sh /compile_page.sh`
  - `RUN chmod +x /compile_page.sh`
Update both if you rename or move the script.

## Troubleshooting
- Docker daemon not running: start Docker Desktop; WSL2 & Linux containers enabled. Test with `docker version` and `docker run hello-world`.
- Script not found / exit 127: ensure `start_cmd` uses the absolute path and the script has LF line endings on Windows.
- Template 404: ensure the template exists in your E2B team and `.env` points to the correct ID/name.

## Do I need Docker always?
No. Only when building/publishing templates. After publishing and setting `E2B_TEMPLATE_ID` in `.env`, you can stop Docker; the app uses E2B Cloud at runtime.
