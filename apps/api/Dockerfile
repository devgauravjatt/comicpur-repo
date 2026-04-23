FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

ENTRYPOINT ["node", "build/index.mjs"]