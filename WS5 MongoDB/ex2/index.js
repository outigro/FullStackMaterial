'use strict';

// import mongoose
var mongoose = require('mongoose');
var async = require('async');

//import Student model
var Student = require('./student');

//connect to DB
var db = mongoose.connect('mongodb://localhost/laurea_workshop');

// create new users
async.parallel([function (cb){Student.create({name: 'Armand', age:21}); cb();},
		function (cb){Student.create({name: 'Bob', age:20}); cb();},
		function (cb){Student.create({name: 'Maria', age:21});cb();}],
	       find);


function find() {
    Student.find({
	age:21
    }, log);
}


function log(err, students) {
    if (err) return;
    console.log(students);
    Student.remove({}, stop);
}

function stop() {
    db.disconnect();
}
