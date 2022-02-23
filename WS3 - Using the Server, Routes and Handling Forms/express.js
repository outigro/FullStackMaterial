// Include express module and instantiate it
var express = require('express');
var app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(8081, function () {
  console.log('Example app listening on port 3000!');
});
