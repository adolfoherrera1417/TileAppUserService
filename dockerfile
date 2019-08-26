FROM node:10.16.0-alpine

RUN mkdir -p /app/rod-tile-server
WORKDIR /app/rod-tile-server

COPY package.json /app/rod-tile-server
COPY package-lock.json /app/rod-tile-server

RUN npm install

COPY . /app/rod-tile-server

CMD ["npm","run","start"]