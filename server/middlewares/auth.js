const jwtHelpers = require('../utils/jwtHelpers');

module.exports.auth = (req, res, next) => {
  let token = req.headers.authorization;
  token = token ? token.split(' ')[1] : null;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const decoded = jwtHelpers.verifyJwt(token);
  if (!decoded) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  req.userId = decoded.id;
  next();
};
