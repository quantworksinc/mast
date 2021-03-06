FROM node:9.5-alpine

MAINTAINER label="Will Palmer <will.palmer@quantworks.com>"

WORKDIR /srv

ADD package.json .
ENV HTTP=80
ENV HTTPS=443

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
ONBUILD RUN \
    openssl genrsa -out ./cert/ssl.key 2048 && \
    openssl req \
        -new -x509 \
        -key ./cert/ssl.key \
        -out ./cert/ssl.cert \
        -days 3650 \
        -subj /CN=localhost

VOLUME /srv/api

CMD ["npm", "run", "start"]
