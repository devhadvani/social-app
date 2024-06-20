# Use the official Node.js image from the Docker Hub
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install --include=dev

# Ensure Vite is installed globally
RUN npm install -g vite

# Install @vitejs/plugin-react explicitly
RUN npm install --save-dev @vitejs/plugin-react

# Create a symbolic link for global node_modules
RUN ln -s /usr/local/lib/node_modules/ ../node_modules

# Copy the rest of the code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the application using Vite preview
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
