const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const multer = require('multer');
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
  res.status(404).json({ message: 'Not found' });
});

mongoose.connect(process.env.DB_URL).then(() => {
  console.log('Connected to DB');
});

module.exports = app;
