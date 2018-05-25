FROM debian:jessie

RUN apt-get update
RUN apt-get install -y curl build-essential python libc6-dev-i386 lib32stdc++-4.9-dev
RUN curl -fsSL get.docker.com | bash

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm

RUN curl curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
