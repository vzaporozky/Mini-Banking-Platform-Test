FROM node:20-slim AS deps

RUN mkdir /app && chown node:node /app

USER node
WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production --ignore-scripts

FROM node:20 AS builder
RUN mkdir /app && chown node:node /app

USER node
WORKDIR /app

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node src ./src 
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node package*.json ./

RUN npm run build

FROM node:20-slim AS production    
RUN apt-get update -y && apt-get install -y openssl

RUN mkdir -p /app && chown node:node /app   

USER node
WORKDIR /app

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=deps /app/node_modules ./node_modules 

EXPOSE 3000

CMD ["node", "./dist/src/main.js"]