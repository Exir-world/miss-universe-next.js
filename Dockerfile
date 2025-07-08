# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Pass these as build args
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GAME_NAME

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy all app code
COPY . .

# Inject envs into Next.js
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_GAME_NAME=${NEXT_PUBLIC_GAME_NAME}

# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --only=production

# Copy app build and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
