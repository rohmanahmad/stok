FROM node:alpine

WORKDIR /app

COPY ./src/ .

RUN npm i

RUN node server.js

EXPOSE 3000