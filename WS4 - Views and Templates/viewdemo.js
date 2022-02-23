// server.js
// load the things we need
var express = require("express");
var app = express();
// Serve static content from this dir
app.use(express.static('public'));

// set the view engine to ejs
app.set("view engine", "ejs");
app.locals.pretty = true;

// use res.render to load up an ejs view file

// index page
app.get("/", function(req, res) {
  res.render("pages/index");
});

app.get("/firsttry", function(req, res) {
  res.render("pages/firsttry");
});

app.get("/secondtry", function(req, res) {
  res.render("pages/firsttry-with-variablees");
});

// about page
app.get("/about", function(req, res) {
  res.render("pages/about", {
    new_heading: "This was passed from the JS file",
    new_paragraph: __dirname,
    new_footer: "Here is the new footer"
  });
});

// Passing an object as data
var data = {
  users: [
    { name: "John", age: 25 },
    { name: "Mike", age: 42 },
    { name: "Samantha", age: 51 }
  ]
};

app.get("/users", function(req, res) {
  res.render("pages/users", data);
});

// Passing an array as data
var seconddata = [

 { name: 'John', age: 25 },
 { name: 'Mike', age: 42 },
 { name: 'Samantha', age: 51 }
 ];

app.get('/anotherusers', function(req, res){
 res.render('pages/anotherusers', {users: seconddata });
});

// Passing an array as data
var testdata = [
    { name: 'John', age: 25 },
    { name: 'Mike', age: 42 },
    { name: 'Samantha', age: 51 }
    ];

   app.get('/testusers', function(req, res){
    res.render('pages/testusers', {data: testdata});
   });
var seconddata = [
  { name: "John", age: 25 },
  { name: "Mike", age: 42 },
  { name: "Samantha", age: 51 }
];

app.get("/anotherusers", function(req, res) {
  res.render("pages/users", { users: seconddata });
});


app.listen(8081);
console.log("8081 is the magic port");
