"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../../middleware/auth"));

var _profile = _interopRequireDefault(require("../../models/profile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express.default.Router(); // get profile for logged in user by accessing api/profile/me carrying a jwt


router.get('/me', _auth.default,
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var profileUser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _profile.default.find({
              user: req.user.id
            }).populate('user', ['name', 'email']);

          case 3:
            profileUser = _context.sent;

            if (profileUser) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              msg: "User hasn't set up his/her profile yet"
            }));

          case 6:
            return _context.abrupt("return", res.json(profileUser));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).send('Server Error'));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // post to a user id

router.post('/', _auth.default,
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, entryno, age, phone, education, profileFields, profile;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, entryno = _req$body.entryno, age = _req$body.age, phone = _req$body.phone, education = _req$body.education; // Build profile object

            profileFields = {};
            profileFields.user = req.user.id;
            profileFields.entryno = entryno;
            profileFields.age = age;
            profileFields.phone = phone;
            profileFields.education = education;
            _context2.prev = 7;
            _context2.next = 10;
            return _profile.default.findOne({
              user: req.user.id
            });

          case 10:
            profile = _context2.sent;

            if (!profile) {
              _context2.next = 16;
              break;
            }

            _context2.next = 14;
            return _profile.default.findOneAndUpdate({
              user: req.user.id
            }, {
              $set: profileFields
            }, {
              new: true
            });

          case 14:
            profile = _context2.sent;
            return _context2.abrupt("return", res.json(profile));

          case 16:
            profile = new _profile.default(profileFields);
            _context2.next = 19;
            return profile.save();

          case 19:
            return _context2.abrupt("return", res.json(profile));

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](7);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).send('Server Error'));

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 22]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); // get profile by id for public access by accessing api/profile/user/:user_id

router.get('/user/:user_id',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var profile;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _profile.default.find({
              user: req.params.user_id
            }).populate('user', ['name', 'email']);

          case 3:
            profile = _context3.sent;

            if (profile) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              msg: 'Profile not found for this user'
            }));

          case 6:
            return _context3.abrupt("return", res.json(profile));

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

            if (!(_context3.t0.kind === 'ObjectId')) {
              _context3.next = 14;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              msg: 'Profile not found for this user'
            }));

          case 14:
            return _context3.abrupt("return", res.status(500).send('Server error'));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;