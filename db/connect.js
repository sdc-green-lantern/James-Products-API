require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const { POSTGRES_USER, POSTGRES_PWD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;

const sequelize = new Sequelize(`postgres://${POSTGRES_USER}:${POSTGRES_PWD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`);

const Feature = sequelize.define('Feature', {
  name: {
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.STRING,
  },
});

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
  },
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slogan: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
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

const ProductFeature = sequelize.define('products_features', {
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

const RelatedProduct = sequelize.define('RelatedProduct', {
  product1Id: {
    type: DataTypes.INTEGER,
    field: 'product1_id',
    references: {
      model: Product,
      key: 'id',
    },
  },
  product2Id: {
    type: DataTypes.INTEGER,
    field: 'product2_id',
    references: {
      model: Product,
      key: 'id',
    },
  },
}, {
  tableName: 'related_products',
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
    type: DataTypes.STRING,
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

const Size = sequelize.define('Size', {
  name: {
    type: DataTypes.STRING,
  },
});

const SKU = sequelize.define('SKU', {
  quantity: {
    type: DataTypes.INTEGER,
  },
  sizeId: {
    type: DataTypes.INTEGER,
    field: 'size_id',
    references: {
      model: Size,
      key: 'id',
    },
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

const Photo = sequelize.define('Photo', {
  styleId: {
    type: DataTypes.INTEGER,
    field: 'style_id',
    references: {
      model: Style,
      key: 'id',
    },
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    field: 'thumbnail_url',
  },
  url: {
    type: DataTypes.STRING,
  },
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
