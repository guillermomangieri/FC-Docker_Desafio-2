FROM node:23-alpine3.19

WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

RUN npm init -y
RUN npm install express

CMD ["node", "index.js"]