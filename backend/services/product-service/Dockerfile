FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (omit dev in production)
RUN npm install --omit=dev

COPY . .

EXPOSE 3001

CMD ["node", "src/app.js"]