/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFull API to monitor up or down time of user defined links.
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 *
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

// app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

app.createServer();
