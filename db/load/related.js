const sequelize = require('../connect.js');
const { extractData } = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

const relatedData = extractData('./db/related.csv');
const transformed = relatedData.map(
  ({id, current_product_id, related_product_id}) =>
    ({id, ProductId: current_product_id, RelatedId: related_product_id})
);
RelatedProduct.bulkCreate(transformed);
