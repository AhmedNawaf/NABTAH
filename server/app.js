const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const data = require('./data.json');
const Product = require('./models/Product');
const app = express();

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static('images'));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

mongoose.connect(process.env.DB_URL).then(async () => {
  const prodcuts = await Product.find();
  if (prodcuts.length > 0) return;
  data.products.forEach(async (product) => {
    const newProduct = new Product({
      name: product.name,
      description: product.description,
      price: product.price,
      image: '/images/' + product.image,
      category: product.category,
    });
    await newProduct.save();
  });
});

module.exports = app;
