const sequelize = require('../connect.js');
const { extractData } = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;


// load features
const stylesData = extractData('./db/styles.csv');

const transformed = stylesData.map(
  ({ id, productId, name, sale_price, original_price, default_style }) => ({ id, productId, name, default_style, sale_price: (sale_price || 0) })
);
Style.bulkCreate(stylesData);
