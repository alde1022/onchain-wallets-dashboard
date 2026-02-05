FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install deps with verbose output
RUN npm ci --legacy-peer-deps 2>&1 || (echo "NPM INSTALL FAILED" && exit 1)

# Try to run TypeScript check
RUN npm run check 2>&1 || echo "TypeScript check had errors (continuing anyway)"

# Build
RUN npm run build 2>&1 || (echo "BUILD FAILED" && exit 1)

# Show what was built
RUN ls -la dist/ 2>/dev/null || echo "No dist folder"

EXPOSE 5000

CMD ["npm", "start"]
