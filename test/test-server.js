// A simple test server that serves all files in `test-sites/` and accepts POST
// requests.

const http = require("http");
const static = require("node-static");

const port = 8888;

const staticFiles = new static.Server(`${__dirname}/test-sites/`);

const httpServer = http.createServer((req, res) => {
  if (req.method == "GET") {
    // Every GET request is simply served as static file.
    return staticFiles.serve(req, res);
  }

  req
    .on("data", (chunk) => {})
    .on("end", () => {
      const headers = req.url.startsWith("/amazon-multipart-upload")
        ? { ETag: `"${Math.round(Math.random() * 10000)}"` }
        : undefined;
      res.writeHead(200, headers);
      res.end('{"success": true}');
    });
});

httpServer.listen(port);

console.log(`Running on http://localhost:${port}`);
