# Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build Next.js app
RUN npm next build

# Production Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --only=production

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
