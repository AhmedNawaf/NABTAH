const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  const product = new Product({
    name,
    price,
    description,
    category,
    quantity,
    image: req.file.filename,
  });
  await product.save();
};

exports.modifyProduct = async (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.quantity = quantity;
    await product.save();
    res.json({ message: 'Product updated' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    fs.unlinkSync(path.join(__dirname, `../images/${product.image}`));

    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
