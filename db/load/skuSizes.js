const sequelize = require('../connect.js');
const { extractData } = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;


// load features
const page = process.argv[2];
if (page) {
  const skuData = extractData(`./db/skus${page}.csv`);
  SKU.bulkCreate(skuData);
} else {
  console.log('you need to supply an argument!');
}
/* id,styleId,size,quantity */

//sizesData = new Set(skuData.map(sku => sku.size).sort())

//Size.bulkCreate(sizesData.map((size, i) => { id: i + 1, name: size }));

/*
const transformed = skuData.map(
  ({id, styleId, size, quantity})=> (
    {
      id,
      styleId,
      quantity,
      sizeId: sizesData.indexOf(size) + 1
    }
  )
);
*/

//SKU.bulkCreate(transformed);

// Style.bulkCreate(featuresData);
/* id, styleId, size, quantity */
