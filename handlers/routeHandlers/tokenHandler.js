/*password
 * Title: Token Handler
 * Description: Handler to handle token related route
 * Author: Iftekher Hossen Sajjad
 * Date: 8/2/2024
 */

// dependencies
const {
  hash,
  createRandomString,
  parseJSON,
} = require("../../helpers/utilities");
const data = require("../../lib/data");

// moduler scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callBack) => {
  let { phone, password } = requestProperties.body;

  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : null;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : null;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);

      if (hashedPassword === parseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = { phone, expires, id: tokenId };

        //   store the token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callBack(200, tokenObject);
          } else {
            callBack(500, { error: "There was a problem in the server side!" });
          }
        });
      } else {
        callBack(400, { error: "Password is not valid!" });
      }
    });
  } else {
    callBack(400, "There have a problem in your request.");
  }
};

handler._token.get = (requestProperties, callBack) => {
  let { id } = requestProperties.queryStringObject;
  // check the id if valid
  id = typeof id === "string" && id.trim().length === 20 ? id : null;

  if (id) {
    // lookup the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };

      if (!err && tokenData) {
        callBack(200, token);
      } else {
        callBack(404, { error: "Requested token was not found!" });
      }
    });
  } else {
    callBack(404, { error: "Requested token was not found!" });
  }
};

handler._token.put = (requestProperties, callBack) => {
  let { id, extend } = requestProperties.body;

  id = typeof id === "string" && id.trim().length === 20 ? id : null;

  extend = typeof extend === "boolean" && extend === true ? extend : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", id, tokenObject, (err) => {
          if (!err) {
            callBack(200);
          } else {
            callBack(500, { error: "There was a problem in the server!" });
          }
        });
      } else {
        callBack(400, { error: "Token already expired!" });
      }
    });
  } else {
    callBack(400, { error: "There was a problem in your request!" });
  }
};

handler._token.delete = (requestProperties, callBack) => {
  let { id } = requestProperties.queryStringObject;

  // check the id if valid
  id = typeof id === "string" && id.trim().length === 20 ? id : null;

  if (id) {
    // lookup the token
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callBack(200, { error: "Token was deleted successfully." });
          } else {
            callBack(500, { error: "There was a problem in the server!" });
          }
        });
      } else {
        callBack(500, { error: "There was a problem in the server!" });
      }
    });
  } else {
    callBack(400, { error: "There was a problem in your request" });
  }
};

handler._token.verify = (id, phone, callBack) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
        callBack(true);
      } else {
        callBack(false);
      }
    } else {
      callBack(false);
    }
  });
};
module.exports = handler;
