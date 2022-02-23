'use strict';

var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/laurea_workshop');

var Student = mongoose.model('Student', new mongoose.Schema({
  'name': String,
  'age': Number
}));

Student.find({}, log);

function log(err, students) {
  if (err) return;
  console.log(students);
  db.disconnect();
}
