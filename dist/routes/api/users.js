"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _check = require("express-validator/check");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _keys = require("../../config/keys");

var _users = _interopRequireDefault(require("../../models/users"));

require("babel-polyfill");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express.default.Router(); // find all users


router.get('/', function (req, res) {
  _users.default.find().then(function (users) {
    return res.json(users);
  });
}); // create a new user

router.post('/', [(0, _check.check)('name', 'Name is Required').not().isEmpty(), (0, _check.check)('email', 'Not Valid Email').isEmail(), // here we need to add valid IIT email address,so I need to add condtions for that also
(0, _check.check)('password', 'Password is Required').not().isEmpty()],
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var errors, email, user, salt, payload;
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

            if (!user) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              errors: [{
                msg: 'user already exists'
              }]
            }));

          case 10:
            user = new _users.default(req.body); // also need to add email verifier via otp
            // encrypt the password using bcrypt

            _context2.next = 13;
            return _bcryptjs.default.genSalt(10);

          case 13:
            salt = _context2.sent;
            _context2.next = 16;
            return _bcryptjs.default.hash(user.password, salt);

          case 16:
            user.password = _context2.sent;
            _context2.next = 19;
            return user.save();

          case 19:
            // res.json(user)
            // return webtoken
            payload = {
              user: {
                id: user.id // with this we can access req.user.id

              }
            };

            _jsonwebtoken.default.sign(payload, _keys.secretkey, {
              expiresIn: 3600
            },
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, token) {
                var transporter, info;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!err) {
                          _context.next = 3;
                          break;
                        }

                        console.log(err);
                        return _context.abrupt("return", null);

                      case 3:
                        _context.prev = 3;
                        transporter = _nodemailer.default.createTransport({
                          host: 'smtp.ethereal.email',
                          port: 587,
                          auth: {
                            user: 'pearl.osinski81@ethereal.email',
                            pass: 'HnhJH9D6QVSCcQAuEp'
                          }
                        }); // send mail with defined transport object

                        _context.next = 7;
                        return transporter.sendMail({
                          from: '"jatinprakash 👻" <jatin000005@gmail.com>',
                          // sender address
                          to: user.email,
                          // list of receivers
                          subject: 'Hello ✔',
                          // Subject line
                          text: "http://localhost:5000/api/user/verify/".concat(token),
                          // plain text body
                          html: "<b>http://localhost:5000/api/user/verify/".concat(token, "</b>") // html body

                        });

                      case 7:
                        info = _context.sent;
                        console.log('Message sent: %s', info.messageId); // Preview only available when sending through an Ethereal account

                        console.log('Preview URL: %s', _nodemailer.default.getTestMessageUrl(info));
                        return _context.abrupt("return", res.json({
                          msg: 'We have sent email containing otp'
                        }));

                      case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](3);
                        console.log(_context.t0);

                      case 16:
                        return _context.abrupt("return", null);

                      case 17:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[3, 13]]);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }());

            _context2.next = 27;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).send('Server error'));

          case 27:
            return _context2.abrupt("return", null);

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 23]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.delete('/:id', function (req, res) {
  _users.default.findByIdAndDelete(req.params.id, function (err) {
    if (err) res.status(404).json({
      success: false
    });else res.json({
      success: true
    });
  });
});
router.get('/verify/:jwt',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var token, decoded, founduser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = req.params.jwt;

            if (token) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(401).json({
              msg: 'Authorization denied as no token present'
            }));

          case 3:
            _context3.prev = 3;
            decoded = (0, _jsonwebtoken.verify)(token, _keys.secretkey); // this will give us the user:id in req.user.id

            _context3.next = 7;
            return _users.default.findById(decoded.user.id).select('-password');

          case 7:
            founduser = _context3.sent;
            founduser.isverified = true; // console.log(founduser);

            _context3.next = 11;
            return founduser.save();

          case 11:
            res.status(200).json({
              msg: 'Your account has been verified..Please login to access your account'
            });
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](3);
            console.error(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              msg: 'Token not valid'
            }));

          case 18:
            return _context3.abrupt("return", null);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 14]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;