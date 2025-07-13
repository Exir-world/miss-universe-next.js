# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GAME_NAME
ARG NEXT_REFERRAL_URL
ARG NEXT_GAME_NAME

# Export them so Next.js can embed them
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_GAME_NAME=${NEXT_PUBLIC_GAME_NAME}
ENV NEXT_REFERRAL_URL=${NEXT_REFERRAL_URL}
ENV NEXT_GAME_NAME=${NEXT_GAME_NAME}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build the Next.js app (envs will be embedded here)
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --only=production

# Copy build artifacts and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# If you use next.config.js or other static configs at runtime:
# COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]
