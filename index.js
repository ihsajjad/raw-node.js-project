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
const environment = require("./helpers/environments");
const data = require("./lib/data");

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

app.createServer();
