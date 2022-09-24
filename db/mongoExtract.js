const mongoose = require('mongoose');
const sequelize = require('./connect.js');
const { Op } = require('sequelize');

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
  default_price: Number,
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

const transform = ({id, name, slogan, description, defaultPrice, Features, Styles, Category, Related}, done) => {
  const features = Features.map(f => ({feature: f.name, value: f.value}));
  const styles = Styles.map(({style_id: id, name, default_style, Photos, SKUs}) => {
    let photos = Photos.map(({ thumbnailUrl, url }) => ({ thumbnail_url: thumbnailUrl, url }));
    return {
      id, name, default_style, photos,
      skus: SKUs.reduce((memo, { id, quantity, size })  => {
        memo[id] = { quantity, size };
        return memo;
      }, {} )
    };
  });
  const related = Related.map(({id}) => id);
  return { id, name, slogan, description, default_price: defaultPrice,
    category: Category.name, features, styles, related
  };
};

/*
let count = min - 1;
function start() {
  count += 1;
}
function done() {
  if (count <= max) {
    extractAndLoad(count + 1);
  }
}
*/

const wrapper = async (first, last) => {
  //const first = 1;
  //const last = 10000012;
  const chunkSize = 100;
  let begin = first;
  let end = chunkSize + begin - 1;

  done = () => {
    begin = end + 1;
    end += chunkSize;
    if (begin <= last) {
      console.log(`new ${begin}, ${end}`);
      extractAndLoad(begin, end);
    }
  };

  const extractAndLoad = async (a, b) => {
    console.log(`extractAndLoad called with ${a}, ${b}`);
    //let data;
    //start();
    Product.findAll({
      where: {
        id: {
          [Op.and]: { [Op.lte]: b, [Op.gte]: a }
        }
      },
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
    }).then((records) => { done(); return records; }).then((records)=> {
      const data = records.map(transform)
      product.insertMany(data).then(() => console.log(data));
    });//.then(done);
    //console.log(newProduct.styles);
  };
  /* start 16 concurrent transfers (mongo maxPool size) */
  /*
  for (let j = min; j <= (min + 12); j++) {
    extractAndLoad(j);
  }
  */
  extractAndLoad(begin, end);
}
/*
let max = 500006;
let step = 31250;
let count = 1;

while( count <= (max + step) ) {
  wrapper(count, count + step);
  count += step;
}
*/

wrapper(1, 62501);
wrapper(62502, 12502);
wrapper(12503, 187503);
wrapper(187504, 250004);

wrapper(250005, 375006);
wrapper(375007, 437507);
wrapper(437508, 500008);
wrapper(500009, 562509);

/*
wrapper(562510, 625010);
wrapper(625011, 687511);
wrapper(687512, 750012);
wrapper(750013, 812513);

wrapper(812514, 937515);
wrapper(937515, 1000012);
*/

