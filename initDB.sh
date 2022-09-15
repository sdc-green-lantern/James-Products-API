#!/bin/sh

node db/initDB.js
#node --max-old-space-size=8192 db/load.js

node db/load/productsCategories.js
node db/load/features.js
node db/load/productFeatures.js
