const express = require('express');
const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
require('dotenv').config();

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;

app = express();
app.use(express.json())

// server configured for 64k
mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, {maxPoolSize: 1000});

const productSchema = new mongoose.Schema({
  _id: { type: Object, hide: true },
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
});

const productInfoSchema = new mongoose.Schema({
  _id: { type: Object, hide: true },
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  features: [ { _id: { type: Object, hide: true }, feature: String, value: String } ],
  /*
  styles: [
    {
      _id: { type: Object, hide: true },
      id: Number,
      name: String,
      'default?': Boolean,
      photos: [ { _id: { type: Object, hide: true }, thumbnail_url: String, url: String } ],
      skus: {
        _id: { type: Object, hide: true },
        quantity: Number,
        size: String
      }
    }
  ],
  related: [ Number ]
  */
});

const styleSchema = new mongoose.Schema({
  _id: { type: Object, hide: true },
  product_id: Number,
  results: [ {
    _id: { type: Object, hide: true},
    style_id: Number,
    name: String,
    sale_price: Number,
    original_price: Number,
    'default?': Boolean
  } ]
});

const relatedSchema = new mongoose.Schema({
  _id: { type: Object, hide: true },
  id: Number,
  related: [ Number ]
})

const Product = mongoose.model('Product', productSchema);
const ProductInfo = mongoose.model('products-info', productInfoSchema);
const Style = mongoose.model('Style', styleSchema);
const Related = mongoose.model('RelatedProduct', relatedSchema);

app.get('/products', async (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const start = ((page - 1) * count) + 1;
  const end = (page * count);
  Product.find({id: { $gte: start, $lte: end } }, { _id: 0 }).then( (records) => res.send(records) );
  // consider splitting queries?
});

app.get('/products/:productId', (req, res) => {
  ProductInfo.findOne({id: req.params.productId}, {_id: 0}).then((product) => res.send(product));
});

app.get('/products/:productId/styles', (req, res) => {
  Style.findOne({product_id: req.params.productId}, {_id: 0}).then((styles) => res.send(styles));
});

app.get('/products/:productId/related', (req, res) => {
  Related.findOne({id: req.params.productId}).then(({related}) => res.send(related));
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
