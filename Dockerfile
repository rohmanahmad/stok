FROM node:alpine

WORKDIR /app

COPY ./src /app

RUN npm i

EXPOSE 3000