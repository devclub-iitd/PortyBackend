"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _jsonwebtoken = require("jsonwebtoken");

var _keys = require("../config/keys");

function _default(req, res, next) {
  // get token from header
  var token = req.header('x-auth-token'); // check if there is no token

  if (!token) {
    return res.status(401).json({
      msg: 'Authorization denied as no token present'
    });
  } // check the validity of the token


  try {
    var decoded = (0, _jsonwebtoken.verify)(token, _keys.secretkey);
    req.user = decoded.user; // this will give us the user:id in req.user.id

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: 'Token not valid'
    });
  }

  return null;
}