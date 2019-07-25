"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _check = require("express-validator/check");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _auth = _interopRequireDefault(require("../../middleware/auth"));

var _keys = require("../../config/keys");

var _users = _interopRequireDefault(require("../../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express.default.Router();

router.get('/', _auth.default,
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _users.default.findById(req.user.id).select('-password');

          case 3:
            user = _context.sent;
            res.json(user);
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            res.status(500).send('Server error');

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // login

router.post('/', [(0, _check.check)('email', 'email is Required').not().isEmpty(), (0, _check.check)('password', 'password is Required').not().isEmpty()],
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var errors, email, user, isMatch, payload;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            errors = (0, _check.validationResult)(req);

            if (errors.isEmpty()) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              errors: errors.array()
            }));

          case 3:
            _context2.prev = 3;
            // see if user exists
            email = req.body.email;
            _context2.next = 7;
            return _users.default.findOne({
              email: email
            });

          case 7:
            user = _context2.sent;

            if (user) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              errors: [{
                msg: 'invalid login details'
              }]
            }));

          case 10:
            _context2.next = 12;
            return _bcryptjs.default.compare(req.body.password, user.password);

          case 12:
            isMatch = _context2.sent;

            if (isMatch) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              errors: [{
                msg: 'invalid login details'
              }]
            }));

          case 15:
            if (user.isverified) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              errors: [{
                msg: 'Your account has not been verified'
              }]
            }));

          case 17:
            // return webtoken
            payload = {
              user: {
                id: user.id
              }
            };

            _jsonwebtoken.default.sign(payload, _keys.secretkey, {
              expiresIn: 3600
            }, function (err, token) {
              if (err) {
                console.log(err);
                return null;
              }

              return res.send({
                token: token
              });
            });

            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).send('Server error'));

          case 25:
            return _context2.abrupt("return", null);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 21]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;