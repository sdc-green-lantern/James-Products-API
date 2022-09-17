const sequelize = require('../connect.js');
const { extractData } = require('../extract.js');

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

const data = extractData('./db/product.csv');
const categories = new Set();

// load categories
data.forEach(record => categories.add(record.category));
categoriesArray = Array.from(categories);
Category.bulkCreate(
  categoriesArray.map((name, i) => ({id: i + 1, name: name}))
);

// transform and load products
const transformed = data.map(
  // change key fields to match Model
  ({id, name, slogan, description, category, default_price}) => (
    {
      id, name, slogan, description,
      defaultPrice: default_price,
      categoryId: categoriesArray.indexOf(category) + 1
    }
  )
);

Product.bulkCreate(transformed);
/* create product id=0 for references contained in related.csv */
Product.create({id: 0, name: 'this product has no related items'})
