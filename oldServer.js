const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('./db/connect.js');

// initialize reference to models
const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

app = express();
app.use(express.json());

/* assuming route is already http://hostname/products/ */
app.get('/', (req, res) => {
  // takes a page and count argument
  // req.params
  // req.query
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  console.log(req.query);
  Product.findAll({ where: { id: { [Op.and]: { [Op.lte]: page * count, [Op.gt]: (page - 1) * count } } } })
  .then(records => res.send(records));
});

app.get('/:product_id', (req, res) => {
  //console.log('pid:', typeof req.params.product_id, req.params.product_id);
  if (!isNaN(Number(req.params.product_id))) {
    Product.findOne({ where: { id: req.params.product_id }, include: Feature })
    .then(record => res.send(record));
  } else {
    res.status(404);
    res.send('invalid product id');
  }
});

app.get('/:product_id/styles', (req, res) => {
  Style.findAll({ where: { productId: req.params.product_id }, include: [Photo, SKU] })
  .then(records => res.send(records));
});

app.get('/:product_id/related', (req, res) => {
	//RelatedProduct.findAll({ attributes: ['RelatedId'],  where: { ProductId: req.params.product_id }})
	RelatedProduct.findAll({ where: { ProductId: req.params.product_id }})
	.then(records => res.send(records.map(r => r.RelatedId)));
	/*
  Product.findOne({ where: { id: req.params.product_id } })
  .then(record => res.send(record.getRelated()));
	*/
});

app.listen(process.argv[2] || 3000, () => {
  console.log('server is running on port 3000');
});
