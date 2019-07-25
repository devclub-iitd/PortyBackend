"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _users = _interopRequireDefault(require("./routes/api/users"));

var _auth = _interopRequireDefault(require("./routes/api/auth"));

var _profile = _interopRequireDefault(require("./routes/api/profile"));

var _keys = require("./config/keys");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)(); // Body Parser Middleware

app.use(_bodyParser.default.json());

_mongoose.default.connect(_keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  console.log('Connected to the database...');
}).catch(function (err) {
  console.log(err);
}); //


app.get('/', function (req, res) {
  res.send('This is the root page!!');
});
app.use('/api/user', _users.default);
app.use('/api/auth', _auth.default);
app.use('/api/profile', _profile.default);
var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Server started at http://localhost:".concat(port));
});