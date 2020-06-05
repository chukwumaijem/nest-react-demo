FROM node:lts-alpine3.9

WORKDIR /app
COPY . /app
RUN rm -rf node_modules
RUN yarn

CMD [ "yarn", "start" ]
