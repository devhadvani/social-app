# Use the official Node.js image from the Docker Hub
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the code into the container
COPY . .

# Build the application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application using Vite preview
CMD ["npm", "run", "dev","--","--host","0.0.0.0"]
