var express = require('express');
var fs = require('fs');
var app = express();

// Require the module required for using form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
 extended: true
})); // for parsing application/x-www-form-urlencoded


// Serve a form to the user
app.get('/adduser', function(req, res) {
 res.sendFile(__dirname + '/public/adduser.html');
});


// Route for form sending the POST data
/*
app.post('/adduser', function (req, res) {
 var data="";
  data += req.body.name +"\n";
  data += req.body.email +"\n";
  data += req.body.company +"\n";
console.log(data);
res.send(data); 
});
*/
// Route for form sending the POST data

app.post('/adduser', function(req, res) {
 // Load the existing data from a file
 var data = require('./exampledata2.json');

 // Create a new JSON object and add it to the existing data variable
 /*
  data.push({
     "Name": "Mika Stenberg",
     "Company": "Laurea",
     "Email": "mika@laurea.fi",
     "Date": "30/3/2016 \r\n"
   });
   */

 data.push({
  "Name": req.body.name,
  "Company": req.body.company,
  "Email": req.body.email,
  "Date": new Date()
  
 });


 // Convert the JSON object to a string format 
 var jsonStr = JSON.stringify(data);

 // Write data to a file
 fs.writeFile('exampledata2.json', jsonStr, (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
 });
 res.send("Saved the data to a file. Browse to the /details to see the contents of the file");
});

// Or we can parse out the details

app.get('/details', function(req, res) {
 var data = require('./exampledata2.json');

 // Parse the results into a variabke
 var results = '<table border="1"> ';

 for (var i = 0; i < data.length; i++) {
  results +=
   '<tr>' +
   '<td>' + data[i].Name + '</td>' +
   '<td>' + data[i].Email + '</td>' +
   '</tr>';
 }

 res.send(results);
});





app.listen(8080, function() {
 console.log('Example app listening on port 8080!');
});
