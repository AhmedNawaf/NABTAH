const User = require('../models/User');
const jwtHelpers = require('../utils/jwtHelpers');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 8),
  });
  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (user && bcrypt.compareSync(password, user.password)) {
    return res.status(200).json({
      message: 'Login successful',
      data: {
        username: user.username,
        accessToken: jwtHelpers.signJwt({ id: user._id }),
      },
    });
  }
  return res.status(400).json({ message: 'Invalid credentials' });
};

module.exports.me = async (req, res) => {
  const user = await User.findById(req.userId);
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};
