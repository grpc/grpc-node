FROM debian:stretch

RUN apt-get update
RUN apt-get install -y cmake curl build-essential python libc6-dev-i386 lib32stdc++-6-dev jq

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
