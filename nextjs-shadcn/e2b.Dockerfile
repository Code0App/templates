# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox in a temp directory
WORKDIR /tmp/app

RUN npx --yes create-next-app@latest . --yes

RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

# Copy everything (including dotfiles) to /home/user and remove temp dir to avoid nesting
RUN mkdir -p /home/user \
	&& cp -a /tmp/app/. /home/user/ \
	&& rm -rf /tmp/app