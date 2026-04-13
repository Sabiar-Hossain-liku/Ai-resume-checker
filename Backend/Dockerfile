# ============================================
# Backend — Production Dockerfile
# ============================================
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
