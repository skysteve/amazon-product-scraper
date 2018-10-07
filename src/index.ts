import { scrapeProductData } from "./puppeteer_scripts/scrapeProductData";

scrapeProductData('B002QYW8LW')
  .then((productData) => {
    console.log(JSON.stringify(productData, null, 2));
  })
  .catch((ex) => {
    console.error(ex);
  });
