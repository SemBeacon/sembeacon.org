FROM mcr.microsoft.com/devcontainers/javascript-node:22
RUN apt-get update && apt-get install -y wget gnupg
RUN apt-get update && apt-get install -y chromium libnss3
RUN ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | sudo debconf-set-selections
RUN apt-get install ttf-mscorefonts-installer
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
