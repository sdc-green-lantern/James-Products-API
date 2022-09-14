const sequelize = require('./connect.js');
const extractData = require('./extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

extractData('./db/product.csv',
  ({id, name, slogan, description, category, default_price}) => {
    // need to work out cateogry
    Product.create({id, name, slogan, description, defaultPrice: default_price});
  }
);

