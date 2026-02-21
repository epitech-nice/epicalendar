FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

# Copy source code after dependencies
COPY . .

EXPOSE 5000

CMD ["pnpm", "run", "dev"]