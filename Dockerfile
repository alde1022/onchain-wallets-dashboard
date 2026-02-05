FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 5000

# Run database migrations and start
CMD ["sh", "-c", "npm run db:push && npm start"]
