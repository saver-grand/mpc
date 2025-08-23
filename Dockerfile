FROM node:18

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create app dir
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
