"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var profileSchema = new _mongoose.Schema({
  // here add all the rest of the features
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  entryno: {
    type: String
  },
  age: {
    type: String
  },
  dob: {
    type: String
  },
  phone: {
    type: String
  },
  education: [{
    institution: {
      type: String,
      required: true
    },
    discipline: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    startdate: {
      type: String
    },
    enddate: {
      type: String
    },
    cgpa: {
      type: String,
      required: true
    },
    maxcgpa: {
      type: String,
      required: true
    },
    courses: [{
      name: {
        type: String
      }
    }]
  }]
});

var _default = (0, _mongoose.model)('profile', profileSchema);

exports.default = _default;