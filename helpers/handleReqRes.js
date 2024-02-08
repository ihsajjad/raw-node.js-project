/*
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const { path, query: queryStringObject } = parsedUrl;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    queryStringObject,
    trimedPath,
    method,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimedPath]
    ? routes[trimedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      //   return the final response
      res.writeHead(statusCode);
      res.end(payloadString);
    });

    res.end("Hello Priends");
  });

  // response handle
};

module.exports = handler;
