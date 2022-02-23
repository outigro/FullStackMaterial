'use strict';

// WHAT IS MONGOOSE
// EXAMPLE Student

var mongoose = require('mongoose');

var Student = mongoose.model('Student', new mongoose.Schema({
  'name': String,
  'age': Number
}));

module.exports = exports = Student;
