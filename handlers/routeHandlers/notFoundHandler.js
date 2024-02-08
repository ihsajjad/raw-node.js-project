/*
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// moduler scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callBack) => {
  callBack(404, {
    message: "Your requested url was not found!",
  });
};

module.exports = handler;
