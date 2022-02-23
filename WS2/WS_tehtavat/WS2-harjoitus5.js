var fs = require("fs");

fs.unlink('combiningfile.txt', (err) => {
    if (err) throw err;
    console.log('combiningfile.txt was deleted');
});