# Use Node.js as the base image
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy built assets and server file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/package*.json ./

# Install only production dependencies needed for the server
RUN npm install --omit=dev && npm install tsx

EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["npx", "tsx", "server.ts"]
