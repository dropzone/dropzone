// Serves test/test-sites/ for the end-to-end tests and accepts uploads.
//
// Every GET is a static file. Anything else is treated as an upload and
// answered with a success body; requests to the multipart endpoint also get an
// ETag header, which is what the S3 multipart flow reads back.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = process.env.TEST_SERVER_PORT || 8888;
const root = path.join(__dirname, "test-sites");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const serveStatic = (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const target = path.join(root, url.endsWith("/") ? `${url}index.html` : url);

  // Resolve through the dist symlink, then confine to the served roots.
  const resolved = path.resolve(target);
  const allowed = [fs.realpathSync(root), fs.realpathSync(path.join(__dirname, ".."))];
  const real = fs.existsSync(resolved) ? fs.realpathSync(resolved) : resolved;
  if (!allowed.some((base) => real.startsWith(base))) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(real, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(real)] || "application/octet-stream",
    });
    res.end(data);
  });
};

const httpServer = http.createServer((req, res) => {
  if (req.method === "GET") return serveStatic(req, res);

  req
    .on("data", () => {})
    .on("end", () => {
      const headers = { "Content-Type": "application/json" };
      if (req.url.startsWith("/amazon-multipart-upload")) {
        headers.ETag = `"${Math.round(Math.random() * 10000)}"`;
      }
      res.writeHead(200, headers);
      res.end('{"success": true}');
    });
});

httpServer.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
