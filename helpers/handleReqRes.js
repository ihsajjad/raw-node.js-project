/*
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");

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

  const decoder = new StringDecoder("utf-8");
  let realData = "";
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
    res.end("Hello Priends");
  });

  // response handle
};

module.exports = handler;
