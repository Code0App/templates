# Security Policy

This folder contains E2B sandbox templates used to spin up ephemeral environments. Keeping these templates secure protects both builders and runtime workloads.

## Reporting a Vulnerability
- Please report vulnerabilities privately using GitHub Security Advisories on the templates repository (Code0App/templates) or your project’s private reporting channel.
- Provide a minimal, reproducible description including affected template, files, and steps to reproduce.
- Do not open public issues for undisclosed vulnerabilities.
- If credentials were exposed (API keys, tokens), revoke/rotate them immediately and note this in your report.

## Scope
- Files under the root (e.g., `nextjs-shadcn/e2b.Dockerfile`, `e2b.toml`, shell scripts) and any artifacts they produce.
- Runtime commands defined in `start_cmd` and installed packages in the image.

## Best Practices for Contributors
- Do not commit secrets. Use environment variables and secret managers; never embed keys in Dockerfiles or scripts.
- Prefer minimal base images and only necessary packages. Remove build tools where possible.
- Pin critical dependency versions when feasible; avoid `latest` for security-sensitive tools.
- Use absolute paths for start scripts and ensure executable permissions are set deliberately.
- Use LF line endings for shell scripts and verify with `bash -n` locally when possible.

## Supported Templates
- Actively maintained templates live inside this repo. Templates without recent updates may receive limited security backports.

## Disclosure Timeline
- We aim to acknowledge within 3 business days and provide an initial assessment or mitigation plan within 10 business days.
