var fs = require("fs");

const path = require('path');

fs.mkdirSync(path.join(__dirname, 'test'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

fs.rmdir("test", () => {
    console.log("Folder Deleted!");

});