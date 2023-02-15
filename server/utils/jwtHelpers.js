const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

module.exports.signJwt = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
};

module.exports.verifyJwt = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }
};
