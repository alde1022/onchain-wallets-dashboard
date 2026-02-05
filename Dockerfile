FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install deps (npm install regenerates lock file)
RUN npm install --legacy-peer-deps

# Build
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
