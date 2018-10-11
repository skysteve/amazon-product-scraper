FROM zenato/puppeteer

USER root

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
# re-install puppeteer
RUN npm install --quiet

EXPOSE 9876
ENV NODE_ENV docker
CMD [ "yarn", "start" ]
