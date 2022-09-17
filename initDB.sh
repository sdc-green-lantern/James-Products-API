#!/bin/sh

node db/initDB.js
#node --max-old-space-size=8192 db/load.js

node db/load/productsCategories.js
node db/load/features.js
node db/load/productFeatures.js
node --max-old-space-size=16384 db/load/related.js
node db/load/styles.js
node --max-old-space-size=16384 db/load/skuSizes.js 1
node --max-old-space-size=16384 db/load/skuSizes.js 2
node --max-old-space-size=16384 db/load/skuSizes.js 3
node --max-old-space-size=16384 db/load/skuSizes.js 4
node --max-old-space-size=16384 db/load/photos.js 1
node --max-old-space-size=16384 db/load/photos.js 2
node --max-old-space-size=16384 db/load/photos.js 3
node --max-old-space-size=16384 db/load/photos.js 4
