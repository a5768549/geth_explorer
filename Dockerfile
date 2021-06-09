FROM node:14.17.0-alpine

WORKDIR /explorer
COPY . .

EXPOSE 8000
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install --global bower
RUN npm install --global http-server
RUN bower install
RUN npm install
RUN npm audit fix
CMD npm start