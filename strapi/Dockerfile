# Dockerfile
FROM node:20.11.1-alpine3.18

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g npm@10.5.0
RUN npm install -g node-gyp
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN ["npm", "run", "build"]
EXPOSE 1337
CMD ["npm", "run", "develop"]
