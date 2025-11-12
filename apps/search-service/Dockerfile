FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Source
COPY . .

# Build
RUN npm run build

# Production Image
FROM node:20-alpine

WORKDIR /app

# Copy nur was nötig ist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Non-Root User
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3007

CMD ["node", "dist/index.js"]
