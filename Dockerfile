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

# Copy built assets including the compiled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server using node directly on the compiled file
CMD ["node", "dist/server.cjs"]
