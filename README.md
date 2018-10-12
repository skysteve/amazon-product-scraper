# amazon-product-scraper
Amazon Product Scraper, simple app to collect data from an amazon product ASIN.

## Installing

### Prerequisites

* [Node.js][1] (8.12+)
* [yarn][2]

### Install Dependencies
To get started, clone the repo and run `yarn`


## Running the app
To run the app, open up a terminal and run `yarn start`

[1]: https://nodejs.org/en/
[2]: https://yarnpkg.com/lang/en/


### Plan

1) On form submit - try to load product from mongodb
2) if that succeeds - return it
3) If not, add to queue to scrape data from amazon
4) add a message to the page to say "this is loading"
5) add websocket to send back the result when complete


## TODO

* add manifest
* add service worker?
* update the url on search
* load products on url change
