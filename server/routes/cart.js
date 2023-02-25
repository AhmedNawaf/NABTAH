const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  modifyCart,
  removeFromCart,
  checkout,
} = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.post('/checkout', auth, checkout);
router.put('/:productId', auth, modifyCart);
router.delete('/:productId', auth, removeFromCart);

module.exports = router;
