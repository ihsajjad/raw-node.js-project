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
const { parseJSON } = require("./utilities");

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const { path, pathname, query: queryStringObject } = parsedUrl;
  const trimedPath = pathname.replace(/^\/+|\/+$/g, "");
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
    requestProperties.body = parseJSON(realData);

    chosenHandler(requestProperties, async (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      //   return the final response
      await res.setHeader("Content-Type", "application/json");
      await res.writeHead(statusCode);
      // res.write();
      await res.end(payloadString);
    });
  });

  // response handle
};

module.exports = handler;
