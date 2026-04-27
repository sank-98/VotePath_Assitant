# Use Node.js as the base image
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build the app
COPY . .
# Force base URL to / for Cloud Run during Docker build
RUN VITE_BASE_URL=/ npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy built assets and server file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./

# Install only production dependencies
# tsx requires typescript even at runtime to process server.ts
RUN npm install --omit=dev --legacy-peer-deps && npm install typescript@~5.8.2 -g && npm install tsx -g

EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server using the globally installed tsx
CMD ["tsx", "server.ts"]
