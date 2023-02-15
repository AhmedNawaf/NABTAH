const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId }).populate(
    'products.productId'
  );
  if (!cart) {
    return res.status(401).json({
      message: 'Cart is empty',
    });
  }
  const total = cart.products.reduce(
    (acc, curr) => acc + curr.productId.price,
    0
  );

  res.status(200).json({
    message: 'Cart fetched',
    cart: {
      userId: cart.userId,
      products: cart.products,
      total: total.toFixed(2),
    },
  });
};

exports.addToCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart) {
    const newCart = new Cart({
      userId: req.userId,
      products: [
        {
          productId: req.body.productId,
        },
      ],
    });

    await newCart.save();
    return res.status(201).json({
      message: 'Cart created',
      cart: {
        userId: newCart.userId,
        products: newCart.products,
      },
    });
  }
  if (cart.products.some((obj) => obj.productId == req.body.productId)) {
    return res.status(400).json({
      message: 'Product already in cart',
    });
  }
  cart.products.push({
    productId: req.body.productId,
  });
  const { products } = await cart.populate('products.productId');
  const total = products.reduce((acc, curr) => acc + curr.productId.price, 0);

  await cart.save();
  res.status(200).json({
    message: 'Product added to cart',
    cart: {
      userId: cart.userId,
      products: cart.products,
      total: total.toFixed(2),
    },
  });
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart) {
    return res.status(401).json({
      message: 'Cart is empty',
    });
  }
  if (!cart.products.some((obj) => obj.productId == req.params.productId)) {
    return res.status(400).json({
      message: 'Product not in cart',
    });
  }
  cart.products = cart.products.filter(
    (obj) => obj.productId != req.params.productId
  );

  const { products } = await cart.populate('products.productId');
  const total = products.reduce((acc, curr) => acc + curr.productId.price, 0);

  await cart.save();
  res.status(200).json({
    message: 'Product removed from cart',
    cart: {
      userId: cart.userId,
      products: cart.products,
      total: total.toFixed(2),
    },
  });
};
