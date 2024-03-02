# Build stage
FROM node:16-alpine as build-stage

# Set the working directory in the Docker container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend application source code
COPY . .

# Build the application
RUN npm run build

# Production stage: Use Nginx to serve the static files
FROM nginx:alpine as production-stage

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Expose port 80 to the outside once the container has launched
EXPOSE 80
