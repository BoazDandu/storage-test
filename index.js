const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//var https = require('https');
//var privateKey  = fs.readFileSync('mybeworld.com.key');
//var certificate = fs.readFileSync('mybeworld.com.crt');

//var credentials = {key: privateKey, cert: certificate};

const app = express();

// Serve static files from the 'public' directory
app.use("/storage", express.static(path.join(__dirname, "../storage")));
const bodyParserConfig = {
  limit: "1024mb",
  extended: true,
};
app.use(bodyParser.json(bodyParserConfig));
app.use(bodyParser.urlencoded({ ...bodyParserConfig, extended: true }));

//var httpsServer = https.createServer(credentials, app);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
