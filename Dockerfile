FROM node:latest

RUN mkdir /code
WORKDIR /code

RUN apt-get update
RUN npm install -g nodemon
RUN apt-get install netcat -y

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "+x", "/code/entry_point.sh"]

ENTRYPOINT ["/code/entry_point.sh"] 