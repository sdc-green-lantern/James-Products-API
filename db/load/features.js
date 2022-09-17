const sequelize = require('../connect.js');
const { extractData } = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;


// load features
const featuresData = extractData('./db/features.csv');
Feature.bulkCreate(
  featuresData.map(
    ({id, product_id, feature, value}) => ({ id: id, name: feature, value: value })
  )
);

