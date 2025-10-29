FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching; lockfile optional
COPY package*.json ./
RUN npm install

# Copy application source
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
