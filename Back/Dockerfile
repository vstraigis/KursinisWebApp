# Use the official Node.js image as the base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the .env file
COPY .env ./


# Copy the rest of the application code
COPY . .

# Expose the port that Express app will run on
EXPOSE 5000

#prisma
RUN npx prisma generate

# Start the Express app
CMD ["npm", "run", "start:migrate:prod"]
