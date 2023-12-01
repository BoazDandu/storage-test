const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const wss = new WebSocket.Server({ noServer: true });

// Serve static files from the 'public' directory
app.use("/storage", express.static(path.join(__dirname, "./storage")));

const bodyParserConfig = {
  limit: "1024mb",
  extended: true,
};
app.use(bodyParser.json(bodyParserConfig));
app.use(bodyParser.urlencoded({ ...bodyParserConfig, extended: true }));

app.get("/storage/:filename", async (req, res) => {
  const filename = req.params.filename; // Corrected variable assignment
  const videoPath = path.join(__dirname, "./storage", filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("File not found");
  }

  // Initiating WebSocket connection on this endpoint
  res.send("WebSocket connection ready for video streaming.");
});

const server = app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

server.on("upgrade", function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
});

wss.on('listening', () => {
  console.log("WebSocket server is running on port 8080");
});


wss.on("connection", (ws, request) => {
  // Extract filename from request URL
  const videoPath = path.join(__dirname, "." + request.url);
  

  if (fs.existsSync(videoPath)) {
    const stream = fs.createReadStream(videoPath, {
      highWaterMark: 128 * 1024,
    }); // Read in chunks
    stream.on("data", (chunk) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(chunk, { binary: true });
      }
    });
    stream.on("end", () => {
      ws.close();
    });
  } else {
    ws.send("File not found");
    ws.close();
  }
});
