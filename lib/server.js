/*
 * Title: Server library
 * Description: Server related file
 * Author: Iftekher Hossen Sajjad
 * Date: 10/2/2024
 *
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./../helpers/handleReqRes");
const environment = require("./../helpers/environments");
const data = require("./data");

// server object - module scaffolding
const server = {};

// create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// handle request response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

// export the server module
module.exports = server;
