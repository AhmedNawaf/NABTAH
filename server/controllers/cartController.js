const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart) {
    return res.status(401).json({
      message: 'Cart is empty',
    });
  }
  const total = cart.products.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
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
  const { name, price, quantity, image, description } = req.body;
  const cart = await Cart.findOne({ userId: req.userId });

  if (!cart) {
    const newCart = new Cart({
      userId: req.userId,
      products: [
        {
          name,
          price,
          quantity,
          image,
          description,
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

  const product = cart.products.find((product) => product.name == name);

  if (product) {
    product.quantity += quantity;
    await cart.save();
    return res.status(200).json({
      message: 'Product quantity updated',
      cart: {
        userId: cart.userId,
        products: cart.products,
      },
    });
  }

  cart.products.push({
    name,
    price,
    quantity,
    image,
    description,
  });

  await cart.save();
  res.status(200).json({
    message: 'Product added to cart',
    cart: {
      userId: cart.userId,
      products: cart.products,
    },
  });
};

exports.modifyCart = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.userId });

  cart.products = cart.products.map((product) => {
    if (product._id == req.params.productId) {
      product.quantity = quantity;
    }
    return product;
  });
  await cart.save();
  return res.status(200).json({
    message: 'Product quantity updated',
    cart: {
      userId: cart.userId,
      products: cart.products,
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

  cart.products = cart.products.filter(
    (product) => product._id != req.params.productId
  );
  await cart.save();
  res.status(200).json({
    message: 'Product removed from cart',
    cart: {
      userId: cart.userId,
      products: cart.products,
    },
  });
};

exports.checkout = async (req, res) => {
  const { cartProducts } = req.body;
  const cart = await Cart.findOne({ userId: req.userId });
  for (const cartProduct of cartProducts) {
    const product = await Product.findOne({ name: cartProduct.name });
    const tempQuantity = product.quantity - cartProduct.quantity;
    if (tempQuantity < 0) {
      return res.status(400).json({
        message: `${product.name} quantity is not enough`,
      });
    }
    product.quantity = tempQuantity;
    await product.save();
  }
  cart.products = [];
  await cart.save();
};
