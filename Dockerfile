FROM node:alpine

WORKDIR /app

COPY ./src/ .

RUN npm i

EXPOSE 3000