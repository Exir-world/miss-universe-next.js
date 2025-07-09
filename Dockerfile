# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GAME_NAME

ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_GAME_NAME=${NEXT_PUBLIC_GAME_NAME}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the Next.js app
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for runtime
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# If you use a custom server (e.g., server.js), copy it:
# COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["npm", "start"]
