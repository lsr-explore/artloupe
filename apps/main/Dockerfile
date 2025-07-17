FROM node:18-alpine

WORKDIR /app

# Copy root lock and manifest
COPY package*.json ./

# Copy tsconfig files
COPY tsconfig*.json ./

# Copy the entire repo (or workspaces + apps)
COPY packages ./packages
COPY apps/main ./apps/main 

# Install all workspaces
RUN npm install

# Set working directory to desired app
WORKDIR /app/apps/main

EXPOSE 3000

# Build if needed (e.g., tsc or next build)
CMD ["npm", "run", "dev"]