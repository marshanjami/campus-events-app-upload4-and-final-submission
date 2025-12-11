# Dockerfile for Campus Life Web App
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# CRITICAL FIX: Install 'serve' globally, as it's needed for 'npm run dev'
RUN npm install -g serve

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start application
CMD ["npm", "run", "dev"]