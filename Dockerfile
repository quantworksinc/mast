FROM node:9.5-alpine

MAINTAINER label="Will Palmer <will.palmer@quantworks.com>"

WORKDIR /srv

ADD package.json .

RUN apk --update add --no-cache git openssl && \
    mkdir cert && \
    openssl genrsa -out ./cert/ssl.key 2048 && \
    openssl req \
        -new -x509 \
        -key ./cert/ssl.key \
        -out ./cert/ssl.cert \
        -days 3650 \
        -subj /CN=localhost && \
    npm install .

ADD server.js .
ADD api.raml .
ONBUILD ADD api.raml .

VOLUME /srv/api

EXPOSE 8080

CMD ["npm", "run", "start"]
