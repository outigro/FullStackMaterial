var fs = require("fs");

const path = require('path');


fs.rmdir("test", () => {
    console.log("Folder Deleted!");

});