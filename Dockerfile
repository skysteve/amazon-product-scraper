FROM mhart/alpine-node:8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

EXPOSE 9876
ENV NODE_ENV docker
CMD [ "yarn", "start" ]
