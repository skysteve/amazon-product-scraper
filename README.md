# amazon-product-scraper
Amazon Product Scraper, simple app to collect data from an amazon product ASIN.

## Running the app

### Prerequisites

* [Docker][4]
* [Google Chrome][5]

### Running locally
To run the app locally

* clone the repo
* run `docker-compose up --build`

This will take a few minutes to pull down the required docker containers and build the project. After this, you should
be able to visit [http://localhost:9876](http://localhost:9876) in Chrome.

**Note that this project uses native web components which is currently only fully supported in Chrome and Firefox 63+**

## Installing for local development

### Prerequisites

* [Node.js][1] (8.12+)
* [yarn][2]
* [MongoDB][3] (you can tweak the config files to use the docker version of mongo if you prefer)

### Install Dependencies
To get started, clone the repo and run `yarn`

### Running the app locally
To run the app, open up a terminal and run `yarn start`. Then as above, you should be able to visit [http://localhost:9876](http://localhost:9876) in Chrome.

## TODO
Below is a list of features/tasks to enhance the app

1) Improve test coverage
2) Add pollyfill for older browsers
3) break process up so fetching products from amazon happens based on items in a queue
4) tidy up styling on the frontend
5) Add indexedDB & service worker for offline support

[1]: https://nodejs.org/en/
[2]: https://yarnpkg.com/lang/en/
[3]: https://www.mongodb.com/
[4]: https://www.docker.com/
[5]: https://www.google.com/chrome/
