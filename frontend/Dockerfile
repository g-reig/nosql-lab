# Use the official Node.js image as a base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ARG REACT_APP_API_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React app for production
RUN npm run build

# Use an Nginx image to serve the app
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8001
EXPOSE 8001

# Run Nginx in the foreground (default command for Nginx)
CMD ["nginx", "-g", "daemon off;"]
