const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  modifyProduct,
  deleteProduct,
} = require('../controllers/productsController');
const multer = require('multer');
const auth = require('../middlewares/auth').auth;
const isAdmin = require('../middlewares/isAdmin');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + fileExt);
  },
});

const multerUpload = multer({ storage: storage });

router.get('/', getProducts);
router.post('/', [auth, isAdmin, multerUpload.single('image')], createProduct);
router.put('/:id', [auth, isAdmin], modifyProduct);
router.delete('/:id', [auth, isAdmin], deleteProduct);

module.exports = router;
