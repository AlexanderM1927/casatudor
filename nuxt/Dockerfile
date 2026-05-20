# Dockerfile
FROM node:20-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN npm install -g npm@11.15.0

# install node dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN npm run build

ENV HOST=0.0.0.0

CMD ["npm", "run", "dev"]