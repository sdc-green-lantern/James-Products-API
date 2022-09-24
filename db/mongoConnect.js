const mongoose = require('mongoose');
const sequelize = require('./connect.js');

mongoose.connect('mongodb://192.168.56.103:27017/green-lantern', { maxPoolSize: 200 });

const {
  Feature, Category, Product, ProductFeature,
  RelatedProduct, Style, Size, SKU, Photo
} = sequelize.models;

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  features: [ { feature: String, value: String } ],
  styles: [
    {
      id: Number,
      name: String,
      default_style: Boolean,
      photos: [ { thumbnail_url: String, url: String } ],
      skus: {
        quantity: Number,
        size: String
      }
    }
  ],
  related: [ Number ]
});

const product = mongoose.model('Product', productSchema);

const saveToDB = ({id, name, slogan, description, Features, Styles, Category, Related}) => {
  const features = Features.map(f => ({feature: f.name, value: f.value}));
  const styles = Styles.map(({id, name, default_style, Photos, SKUs}) => {
    let photos = Photos.map(({ thumbnailUrl, url }) => ({ thumbnail_url: thumbnailUrl, url }));
    let skus = {};
    SKUs.forEach(({ id, quantity, size })  =>  skus[id] = { quantity, size } );
    return { id, name, default_style, photos, skus };
  });
  const related = Related.map(({id}) => id);
  const productInfo = { id, name, slogan, description, category: Category.name, features, styles, related };
  //console.info(productInfo);
  //console.info(styles[0]);
  console.log(`finished  ${id}`);
  const newProduct = new product(productInfo);
  newProduct.save()
};

let count = 0;
function start() {
  count += 1;
}
function done() {
  extractAndLoad(count + 1);
}
const extractAndLoad = (i) => {
  //let data;
  start();
  Product.findOne({
    where: { id: i },
    include: [
      Feature,
      Category,
      {
        model: Style,
        include: [
          Photo,
          SKU
        ]
      },
      'Related'
    ]
  //}).then( ({id, name, slogan, description, Features, Styles, Category, Related}) => {
  }).then( data => saveToDB(data)).then(done);
  //console.log(newProduct.styles);
};
/* start 16 concurrent transfers (mongo maxPool size) */
for (let j = 1; j <= 12; j++) {
  extractAndLoad(j);
}
