FROM zenato/puppeteer

USER root
ENV NODE_ENV docker

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
# re-install puppeteer
RUN npm install --quiet
# build our frontend TS
RUN yarn build

EXPOSE 9876

CMD [ "yarn", "start" ]
