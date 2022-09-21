#!/usr/bin/env python
import os
import csv
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_HOST = os.environ['MONGO_HOST']
MONGO_PORT = os.environ['MONGO_PORT']

client = MongoClient(f'mongodb://{MONGO_HOST}:{MONGO_PORT}')
db = client['green-lantern']

files = [
    'product.csv',
    'features.csv',
    'styles.csv',
    'photos.csv',
    'skus.csv',
    'related.csv',
]

def read_csv(filename):
    data = [];
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

# products

products = {}

for row in read_csv(files[0]):
    row['id'] = int(row['id'])
    row['default_price'] = float(row['default_price'])
    products[row['id']] = row

# features

for row in read_csv(files[1]):
    product_id = int(row['product_id'])
    product_features = products[product_id].setdefault('features', [])
    product_features.append({ 'feature': row['feature'], 'value': row['value'] })

# styles

styles = {};

for row in read_csv(files[2]):
    product_id = int(row['productId'])
    row['id'] = int(row['id'])
    product_styles = products[product_id].setdefault('styles', [])
    style = {
        'style_id': row['id'],
        'name': row['name'],
        'sale_price': 0 if row['sale_price'] == 'null' else float(row['sale_price']),
        'original_price': float(row['original_price']),
        'default?': bool(row['default_style'])
    }
    product_styles.append(style)
    styles[row['id']] = style

# photos

for row in read_csv(files[3]):
    style = styles[ int(row['styleId']) ]
    style_photos = style.setdefault('photos', [])
    style_photos.append({ 'thumbnail_url': row['thumbnail_url'], 'url': row['url'] })

# skus

for row in read_csv(files[4]):
    #row['id'] = int(row['id'])
    row['styleId'] = int(row['styleId'])
    row['quantity'] = int(row['quantity'])
    style = styles[ row['styleId'] ]
    style_skus = style.setdefault('skus', {})
    style_skus[ row['id'] ] = { 'quantity': row['quantity'], 'size': row['size'] }


# related items

for row in read_csv(files[5]):
    current_id = int(row['current_product_id'])
    related_id = int(row['related_product_id'])
    if related_id != 0:
        current_related = products[current_id].setdefault('related', [])
        related_related = products[related_id].setdefault('related', [])
        if current_related.count(related_id) == 0:
            current_related.append(related_id)
        if related_related.count(current_id) == 0:
            related_related.append(current_id)
    else:
        products[current_id].setdefault('related', [])

products = [products[product_id] for product_id in products]

# create and insert into table for /products endpoint
products_db = db['products']

for product in products:
    products_db.insert_one({
        'id': product['id'],
        'name': product['name'],
        'slogan': product['slogan'],
        'description': product['description'],
        'category': product['category'],
        'default_price': product['default_price']
    });

# /products/:product_id table
product_info_db = db['products-infos']

for product in products:
    product_info_db.insert_one({
        'id': product['id'],
        'name': product['name'],
        'slogan': product['slogan'],
        'category': product['category'],
        'default_price': product['default_price'],
        'features': product.setdefault('features', [])
    })

# /products/:product_id/styles
styles_db = db['styles']
for product in products:
    styles_db.insert_one({
        'product_id': product['id'],
        'results': product.setdefault('styles', [])
    })

# /products/:product_id/related
related_db = db['relatedProducts']
for product in products:
    related_db.insert_one({
        'id': product['id'],
        'related': product.setdefault('related', [])
    })
