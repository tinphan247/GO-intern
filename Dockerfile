# Production-ready Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Generate Prisma Client for the native runtime inside the container
RUN npx prisma generate

# Build the Next.js application for production
RUN npm run build

# Expose server port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start application server
CMD ["npm", "run", "start"]
