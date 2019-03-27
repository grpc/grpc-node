FROM debian:jessie

RUN echo "deb http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/backports.list
RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf
RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
RUN apt-get update
RUN apt-get -t jessie-backports install -y cmake
RUN apt-get install -y curl build-essential python libc6-dev-i386 lib32stdc++-4.9-dev jq
RUN curl -fsSL get.docker.com | bash

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
