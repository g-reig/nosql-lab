# Use the official Node.js image as a base image for building the React app
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for the API URL
ARG REACT_APP_API_URL

# Ensure the environment variable is set in the build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React app for production
RUN npm run build

# Use a new image to serve the app with `serve`
FROM node:18-alpine

# Install the `serve` package globally
RUN npm install -g serve

# Set the working directory to the build folder
WORKDIR /app

# Copy the build output from the previous stage to the current container
COPY --from=build /app/build /app/build

# Expose port 8001 for the app
EXPOSE 8001

# Run the app using the `serve` package
CMD ["serve", "-s", "build", "-l", "8001"]
