drop table if exists related_products cascade;
drop table if exists products_features cascade;
drop table if exists categories cascade;
drop table if exists features cascade;
drop table if exists products cascade;
drop table if exists styles cascade;
drop table if exists sizes cascade;
drop table if exists skus cascade;
drop table if exists photos cascade;

create table features (
  id integer primary key,
  name varchar(50),
  value varchar(50)
);

create table categories (
  id integer primary key,
  name varchar(50)
);

create table products (
  id integer primary key,
  name varchar(100) not null,
  slogan varchar(250) not null,
  description varchar(500),
  category_id integer references categories(id),
  default_price numeric,
  created_at timestamp,
  updated_at timestamp
);

create table products_features (
  id integer primary key,
  product_id integer not null references products,
  feature_id integer not null references features
);

create table related_products(
  id integer primary key,
  product1_id integer not null references products,
  product2_id integer not null references products
);

create table styles (
  id integer primary key,
  product_id integer references products,
  name varchar(50),
  sale_price numeric,
  default_style boolean
);

create table sizes (
  id integer primary key,
  name varchar(10)
);

create table skus (
  id integer primary key,
  quantity integer,
  size_id integer references sizes,
  style_id integer references styles
);

create table photos (
  id integer primary key,
  style_id integer references styles,
  thumbnail_url varchar(150),
  url varchar(150)
);
