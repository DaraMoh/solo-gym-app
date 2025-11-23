FROM node:20-alpine

WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli
RUN npm install -g @expo/ngrok

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose Expo default ports
EXPOSE 8081 19000 19001 19002

# Start Expo
CMD ["npx", "expo", "start", "--tunnel"]