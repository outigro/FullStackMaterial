var fs = require("fs");

fs.appendFile('appended.txt', 'data to append \n', (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
});
