# NOTE: We don't have to worry about glibc versions
#       because we use static linking during the
#       compile step.
#       (See packages/grpc-tools/CMakeLists.txt#L25)

FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y cmake curl build-essential \
    python3 libc6-dev-i386-cross libc6-dev-amd64-cross \
    libc6-dev-arm64-cross lib32stdc++6-amd64-cross jq \
    lib32stdc++6-x32-cross libstdc++6-amd64-cross \
    libstdc++6-arm64-cross libstdc++6-i386-cross \
    gcc-i686-linux-gnu g++-i686-linux-gnu tar file \
    gcc-x86-64-linux-gnu g++-x86-64-linux-gnu binutils \
    gcc-aarch64-linux-gnu g++-aarch64-linux-gnu make \
    gcc g++ gzip bash libc6-amd64-i386-cross \
    libc6-dev-amd64-i386-cross

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
