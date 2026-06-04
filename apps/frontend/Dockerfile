FROM node:22-alpine

WORKDIR /app

# Enable pnpm via Corepack (bundled with Node.js)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
