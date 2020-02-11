FROM debian:stretch

RUN dpkg --add-architecture i386
RUN apt-get update
RUN apt-get install -y curl build-essential g++-aarch64-linux-gnu g++-arm-linux-gnueabihf g++-s390x-linux-gnu python libc6-dev:i386 lib32stdc++-6-dev
RUN curl -fsSL get.docker.com | bash

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm

RUN curl curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
