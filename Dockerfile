FROM node:9.5-alpine

MAINTAINER label="Will Palmer <will.palmer@quantworks.com>"

WORKDIR /srv

ADD package.json .

RUN apk --update add --no-cache git && \
    npm install .

ADD server.js .
ADD api.raml .

VOLUME /srv/api

EXPOSE 8080

CMD ["npm", "run", "start"]
