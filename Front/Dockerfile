# First stage: Build the React app
FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Second stage: Serve the app using Nginx
FROM nginx:1.21.3-alpine

# Copy the built app from the first stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]