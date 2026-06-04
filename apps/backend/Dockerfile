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

# Copy prisma schema
COPY src/infra/database/schema.prisma ./src/infra/database/

# Generate Prisma Client
RUN npx prisma generate --schema=./src/infra/database/schema.prisma

# Copy source code
COPY . .

EXPOSE 8000

CMD ["pnpm", "dev"]
