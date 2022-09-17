const sequelize = require('../connect.js');
const { extractData, extractDataAsync } = require('../extract.js');
const asyncQueue = require('async').queue;

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

const page = process.argv[2];
if (page) {
  /*
  const queue = asyncQueue((task, completed) => {
    Photo.create(task);
    const remaining = queue.length();
    console.log(`completed ${task.id}`);
    completed(null, {task, remaining});
  }, 45); // 50 concurrent connections to db
  */
  // load features
  //console.log('loading photos');
  //const photoData = extractData('./db/photos.csv');
  const results = [];
  extractDataAsync(`./db/photos${page}.csv`, ({ id, styleId, url, thumbnail_url }) => {
    /* file is too big for synchronous read, had to stream it */
    /* csv: id, styleId, url, thumbnail_url */
    /* model: id, styleId, url, thumbnailUrl */
    const transformed = {id: id, styleId: styleId, url: url, thumbnailUrl: thumbnail_url};
    results.push(transformed);
    //queue.push({ id, styleId, url, thumbnailUrl: thumbnail_url });
  }, () => {
    console.table(results.slice(0, 20));
    Photo.bulkCreate(results);
  });
  //console.log('done loading photos');

  /* id,styleId,url,thumbnail_url */
  //Photo.bulkCreate(photoData);
} else {
  console.log('You need to supply an argument!');
}
