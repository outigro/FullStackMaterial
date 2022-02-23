// Demo on simple routing using routes within files

var express = require("express");
var app = express();

app.use(express.static("public"));

//Routes
//http://127.0.0.1:8081/    http://127.0.0.1:8081/about
var indexRoutes = require("./routes");
app.use("/", indexRoutes);

//http://127.0.0.1:8081/api/all    http://127.0.0.1:8081/api/add
var apiRoutes = require("./API");
app.use("/api", apiRoutes);

app.listen(8081);
