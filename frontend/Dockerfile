# Build Angular app
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies, including a specific version of @angular/google-maps
RUN npm install @angular/google-maps@17.3.10
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app with production configuration
RUN npm run build -- --configuration production --base-href "/"

# Deploy with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy Angular build output to Nginx's html directory
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
