FROM node:23-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000


CMD ["node", "index.js"]