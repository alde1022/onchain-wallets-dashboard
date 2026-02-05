FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build the app (this will fail if there are TS errors)
RUN npm run build

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
