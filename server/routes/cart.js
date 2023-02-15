const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
} = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getCart);
router.delete('/:productId', auth, removeFromCart);
router.post('/', auth, addToCart);
module.exports = router;
