const jwt = require('jsonwebtoken');
const { httpResponseError } = require('../utils/httpResponse');
const User = require('../models/User');

const checkTokenManager = (req, res, next) => {
  const authorizationHeader = req.headers['x-token-manager'];
  // const token = authorizationHeader && authorizationHeader.split(' ')[1];
  const token = authorizationHeader;
  if (!token) {
    return res.status(401).json(httpResponseError());
  } else {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_MANAGER, (err, user) => {
      if (err) {
        return res.status(403).json(httpResponseError());
      } else {
        req.systemUser = user;
        req.systemUserType = 'manager';
        next();
      }
    });
  }
};

const checkTokenUser = (req, res, next) => {
  const authorizationHeader = req.headers['x-token-user'];

  const token = authorizationHeader;
  if (!token) {
    return res.status(401).json(httpResponseError());
  } else {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_USER, async (err, user) => {
      if (err) {
        return res.status(403).json(httpResponseError());
      } else {
        req.systemUser = user;
        req.systemUserType = 'user';
        next();
      }
    });
  }
};

const checkToken = (req, res, next) => {
  let authorizationHeader = null;
  let authorizationType = null;
  let jwtVerifySignature = null;
  if (req.headers['x-token-user'] && !req.headers['x-token-manager']) {
    authorizationHeader = req.headers['x-token-user'];
    authorizationType = 'user';
    jwtVerifySignature = process.env.JWT_ACCESS_TOKEN_SECRET_USER;
  } else if (!req.headers['x-token-user'] && req.headers['x-token-manager']) {
    authorizationHeader = req.headers['x-token-manager'];
    authorizationType = 'manager';
    jwtVerifySignature = process.env.JWT_ACCESS_TOKEN_SECRET_MANAGER;
  }
  const token = authorizationHeader;
  if (!token) {
    return res.status(401).json(httpResponseError());
  } else {
    jwt.verify(token, jwtVerifySignature, async (err, user) => {
      if (err) {
        return res.status(403).json(httpResponseError());
      } else {
        // const users = await User.findOne({ hashIdAuth: user.hashIdAuth });
        // console.log(user.hashIdAuth); // چک شود
        // if (!users) return res.status(401).json(httpResponseError());
        req.systemUser = user;
        req.systemUserType = authorizationType;
        next();
      }
    });
  }
};

module.exports = {
  checkTokenManager,
  checkTokenUser,
  checkToken,
};
