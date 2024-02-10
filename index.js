/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFull API to monitor up or down time of user defined links.
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 *
 */

// dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");

// app object - module scaffolding
const app = {};

app.init = () => {
  // start the server
  server.init();

  // start the workers
  workers.init();
};

app.init();

// export the module
module.exports = app;
