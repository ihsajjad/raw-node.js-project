/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// moduler scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callBack) => {
  console.log(requestProperties);
  callBack(200, { message: "This is a sample url" });
};

module.exports = handler;
