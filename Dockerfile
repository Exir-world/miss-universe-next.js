FROM node:lts-alpine AS builder

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 make g++

RUN npm install -g npm

ENV NODE_ENV=build

USER node
WORKDIR /home/node

# COPY .npmrc ./
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:lts-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# CMD ["npm", "run", "migration:run"]

CMD ["node", "dist/main.js"]
