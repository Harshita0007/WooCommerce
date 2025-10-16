FROM node:18-alpine

WORKDIR /app

COPY package*.json ./


# Install dependencies (omit dev in production)
RUN npm install --omit=dev

COPY . .

CMD ["node", "src/index.js"]