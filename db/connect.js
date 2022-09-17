require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const { POSTGRES_USER, POSTGRES_PWD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;

const sequelize = new Sequelize(
  `postgres://${POSTGRES_USER}:${POSTGRES_PWD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  {
    pool: {
      max: 50,
      acquire: 100000,
      idle: 1000,
    },
  }
);

const Feature = sequelize.define('Feature', {
  name: {
    type: DataTypes.TEXT,
  },
  value: {
    type: DataTypes.TEXT,
  },
});

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.TEXT,
  },
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  slogan: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  categoryId: {
    type: DataTypes.INTEGER,
    field: 'category_id',
    references: {
      model: Category,
      key: 'id',
    },
  },
  defaultPrice: {
    type: DataTypes.REAL,
    field: 'default_price',
  },
});
//Product.hasOne(Category);
//Product.hasOne(Category);
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});
Category.hasMany(Product);

const ProductFeature = sequelize.define('ProductFeature', {
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: Product,
      key: 'id',
    },
  },
  featureId: {
    type: DataTypes.INTEGER,
    field: 'feature_id',
    references: {
      model: Feature,
      key: 'id',
    },
  },
}, {
  tableName: 'products_features',
});

Product.belongsToMany(Feature, {
  through: ProductFeature, 
  unique: false,
  foreignKey: 'productId'
});
Feature.belongsToMany(Product, {
  through: ProductFeature,
  unique: false,
  foreignKey: 'featureId'
});

const RelatedProduct = sequelize.define('RelatedProduct', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  ProductId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    unique: false,
    references: {
      model: Product,
      key: 'id',
      unique: false,
    },
  },
  RelatedId: {
    type: DataTypes.INTEGER,
    field: 'related_product_id',
    unique: false,
    references: {
      model: Product,
      key: 'id',
      unique: false,
    },
  },
}, {
  tableName: 'related_products',
});

Product.belongsToMany(Product, {
  as: 'Related',
  through: {
    model: RelatedProduct, 
    foreignKey: 'ProductId',
    unique: false,
  },
  //foreignKey: 'RelatedId',
  unique: false,
});

const Style = sequelize.define('Style', {
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: Product,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.TEXT,
  },
  sale_price: {
    type: DataTypes.REAL,
    field: 'sale_price',
  },
  default_style: {
    type: DataTypes.BOOLEAN,
    field: 'default_style',
  },
});
Style.belongsTo(Product, {
  foreignKey: 'productId'
});
Product.hasMany(Style, {
  foreignKey: 'productId'
});

const Size = sequelize.define('Size', {
  name: {
    type: DataTypes.TEXT,
  },
});

const SKU = sequelize.define('SKU', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  size: {
    type: DataTypes.TEXT,
  },
  styleId: {
    type: DataTypes.INTEGER,
    field: 'style_id',
    references: {
      model: Style,
      key: 'id',
    },
  },
});
SKU.belongsTo(Style, {
  foreignKey: 'styleId'
});
Style.hasMany(SKU, {
  foreignKey: 'styleId'
});


const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  styleId: {
    type: DataTypes.INTEGER,
    field: 'style_id',
    references: {
      model: Style,
      key: 'id',
    },
  },
  thumbnailUrl: {
    type: DataTypes.TEXT,
    field: 'thumbnail_url',
  },
  url: {
    type: DataTypes.TEXT,
  },
});

Photo.belongsTo(Style, {
  foreignKey: 'styleId'
});
Style.hasMany(Photo, {
  foreignKey: 'styleId'
});
// reset db
// await sequelize.sync({ force: true });
// console.log('all models synchronized successfully (re-created)');
module.exports = sequelize;

/*
(async () => {
  try {
    await sequelize.authenticate();
    console.log('connection established');
  } catch (err) {
    console.error('unable to connect:', err);
  }
})();
*/
