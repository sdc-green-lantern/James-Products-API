require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const { POSTGRES_USER, POSTGRES_PWD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;

const sequelize = new Sequelize(
  `postgres://${POSTGRES_USER}:${POSTGRES_PWD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  {
    pool: {
      max: 20,
      acquire: 100000,
      idle: 10000,
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

const Size = sequelize.define('Size', {
  name: {
    type: DataTypes.TEXT,
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
    type: DataTypes.TEXT,
    field: 'thumbnail_url',
  },
  url: {
    type: DataTypes.TEXT,
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
