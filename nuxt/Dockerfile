# Dockerfile
FROM node:20.11.1-alpine3.18

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN npm install -g npm@10.5.0

# install node dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN npm run build

ENV PORT=24678
EXPOSE 24678

CMD ["npm", "run", "dev"]