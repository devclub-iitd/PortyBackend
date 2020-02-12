# FROM node:13
# WORKDIR /app
# COPY package.json /app
# RUN npm install
# COPY . /app
# EXPOSE 5000
# CMD ["npm","start"]

FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
COPY . /app
RUN npm start