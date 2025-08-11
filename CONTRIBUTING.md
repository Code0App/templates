# Contributing to Sandbox Templates

Thanks for helping improve the sandbox templates! These templates power ephemeral environments used by the app.

## Ways to Contribute
- Fix bugs in Dockerfiles or start scripts
- Improve build performance or image size
- Add documentation and troubleshooting tips
- Add new templates (e.g., different frameworks or stacks)

## Project Structure
- `sandbox/nextjs/`
  - `e2b.Dockerfile` — Docker build for the template image
  - `e2b.toml` — Template metadata (team, name/ID, start command)
  - `compile_page.sh` — Start script executed inside the sandbox

## Development Workflow
1. Create a feature branch from `main` or your default branch.
2. Make changes to Dockerfile, e2b.toml, or scripts.
3. Test locally:
   - Ensure Docker Desktop is running (Linux containers, WSL2 on Windows)
   - `e2b template build` from the template directory
4. Publish to your E2B team (optional during PRs):
   - `e2b templates publish` (or `templates push/create` depending on CLI version)
5. Open a PR with a clear description and reasoning; include logs if fixing build/runtime errors.

## Coding Guidelines
- Keep Docker images minimal; remove unnecessary packages and caches.
- Use absolute paths and explicit permissions for scripts.
- Ensure shell scripts use LF line endings and have `chmod +x` in Dockerfile.
- Avoid committing secrets; use environment variables instead.

## Environment Variables
- The app expects one of the following set in the root `.env`:
  - `E2B_TEMPLATE_ID`, or
  - `E2B_TEMPLATE_NAME` / `E2B_TEMPLATE`
- For CLI builds/publishes, set `E2B_API_KEY` in your shell session.

## CI Suggestions (optional)
- Add a workflow to lint Dockerfiles and attempt a template build on PRs.
- Cache layers to speed up builds.

## Getting Help
- Open a discussion or draft PR with questions.
- For security issues, follow the process in `SECURITY.md`.
