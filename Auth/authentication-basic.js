const http = require("http");
// Authentication module.
const auth = require("http-auth");
const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "\\users.htpasswd"
});

// Creating new HTTP server.
http
  .createServer(
    basic.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
    })
  )
  .listen(8081);
