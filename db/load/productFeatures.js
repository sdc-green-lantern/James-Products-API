const sequelize = require('../connect.js');
const extractData = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;


// load features
const featuresData = extractData('./db/features.csv');

ProductFeature.bulkCreate(
  featuresData.map(({id, product_id}) =>
    ({ ProductId: product_id, FeatureId: id })
  )
);
