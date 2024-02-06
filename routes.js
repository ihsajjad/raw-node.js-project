/*
 * Title: Routes
 * Description: Application Routes
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandlers");

const routes = {
  sample: sampleHandler,
};

module.exports = routes;
