#!/usr/bin/env python
import os
import csv
import shelve
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_HOST = os.environ['MONGO_HOST']
MONGO_PORT = os.environ['MONGO_PORT']

client = MongoClient(f'mongodb://{MONGO_HOST}:{MONGO_PORT}')
db = client['green-lantern']

# create and insert into table for /products endpoint
products_db = db['products']
product_info_db = db['products-infos']
styles_db = db['styles']
related_db = db['relatedProducts']

with shelve.open('products.shelve') as shelf:
for product_id in range(1, 100012):

    # retrieve product from shelf
    product = shelf[str(product_id)]

    # store data to each endpoint table

    # /products table
    products_db.insert_one({
        'id': product['id'],
        'name': product['name'],
        'slogan': product['slogan'],
        'description': product['description'],
        'category': product['category'],
        'default_price': product['default_price']
    });
    # /products/:product_id table
    product_info_db.insert_one({
        'id': product['id'],
        'name': product['name'],
        'slogan': product['slogan'],
        'category': product['category'],
        'default_price': product['default_price'],
        'features': product.setdefault('features', [])
    })
    # /products/:product_id/styles
    styles_db.insert_one({
        'product_id': product['id'],
        'results': product.setdefault('styles', [])
    })
    # /products/:product_id/related
    related_db.insert_one({
        'id': product['id'],
        'related': product.setdefault('related', [])
    })
