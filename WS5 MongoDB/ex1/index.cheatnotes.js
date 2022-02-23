'use strict';

var mongoose = require('mongoose');
var Student = require('./student');

var db = mongoose.connect('mongodb://localhost/laurea_workshop');

Student.find({}, log);


function log(err, students) {
  if (err) return ;
  console.log(students);
  db.disconnect();
}
