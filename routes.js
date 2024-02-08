/*
 * Title: Routes
 * Description: Application Routes
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandlers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
