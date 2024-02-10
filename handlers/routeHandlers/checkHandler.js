/*
 * Title: Check Handler
 * Description: Handler to handle user defined checks
 * Author: Iftekher Hossen Sajjad
 * Date: 9/2/2024
 */

// dependencies
const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

// moduler scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

handler._check = {};

handler._check.post = (requestProperties, callBack) => {
  let { protocol, url, method, successCodes, timeoutSeconds } =
    requestProperties.body;
  let { token } = requestProperties.headersObject;

  const methods = ["GET", "POST", "PUT", "DELETE"];
  const protocols = ["https", "http"];

  // validating inputs data
  protocol =
    typeof protocol === "string" && protocols.includes(protocol)
      ? protocol
      : false;

  url = typeof url === "string" && url.trim().length > 0 ? url : false;

  method =
    typeof method === "string" && methods.includes(method) ? method : false;

  successCodes =
    typeof successCodes === "object" && successCodes instanceof Array
      ? successCodes
      : false;

  timeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // verify token
    token = typeof token === "string" ? token : false;
    //   lookup the user phone by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let { phone } = parseJSON(tokenData);

        //   lookup the user data
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            _token.verify(token, phone, (isValidToken) => {
              if (isValidToken) {
                let userObject = parseJSON(userData);

                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  const checkId = createRandomString(20);

                  const checkObject = {
                    id: checkId,
                    userPhone: phone,
                    protocol,
                    url,
                    successCodes,
                    method,
                    timeoutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // add check id to the user's object

                      userChecks.push(checkId);
                      userObject.checks = userChecks;

                      // save the new user data
                      data.update("users", phone, userObject, (err) => {
                        if (!err) {
                          // return the data about the new check
                          callBack(200, checkObject);
                        } else {
                          callBack(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callBack(401, {
                    error: "User has already reach max checks limit!",
                  });
                }
              } else {
                callBack(403, { error: "Authentication problem!" });
              }
            });
          } else {
            callBack(403, { error: "User not found!" });
          }
        });
      } else {
        callBack(403, { error: "Authentication problem!" });
      }
    });
  } else {
    callBack(400, { error: "There was a problem in your request!" });
  }
};

handler._check.get = (requestProperties, callBack) => {
  let { id } = requestProperties.queryStringObject;
  let { token } = requestProperties.headersObject;

  id = typeof id === "string" && id.trim().length === 20 ? id : null;

  if (id) {
    // lookup for the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const checkObject = parseJSON(checkData);
        // verify token
        token = typeof token === "string" ? token : false;

        _token.verify(token, checkObject.userPhone, (isValidToken) => {
          if (isValidToken) {
            callBack(200, checkObject);
          } else {
            callBack(500, { error: "Authencation failure!" });
          }
        });
      } else {
        callBack(500, { error: "There was a problem in the server side!" });
      }
    });
  } else {
    callBack(400, { error: "There was a problem in your request!" });
  }
};

handler._check.put = (requestProperties, callBack) => {
  let { id, protocol, url, method, successCodes, timeoutSeconds } =
    requestProperties.body;
  let { token } = requestProperties.headersObject;

  const methods = ["GET", "POST", "PUT", "DELETE"];
  const protocols = ["https", "http"];

  // validating inputs data
  protocol =
    typeof protocol === "string" && protocols.includes(protocol)
      ? protocol
      : false;

  url = typeof url === "string" && url.trim().length > 0 ? url : false;

  method =
    typeof method === "string" && methods.includes(method) ? method : false;

  successCodes =
    typeof successCodes === "object" && successCodes instanceof Array
      ? successCodes
      : false;

  timeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || timeoutSeconds || successCodes) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = parseJSON(checkData);
          // verify token
          token = typeof token === "string" ? token : false;

          _token.verify(token, checkObject.userPhone, (isValidToken) => {
            if (isValidToken) {
              if (protocol) checkObject.protocol = protocol;
              if (url) checkObject.url = url;
              if (method) checkObject.method = method;
              if (timeoutSeconds) checkObject.timeoutSeconds = timeoutSeconds;
              if (successCodes) checkObject.successCodes = successCodes;

              data.update("checks", id, checkObject, (err) => {
                if (!err) callBack(200);
                else {
                  callBack(500, {
                    error: "There was a problem in the server side!",
                  });
                }
              });
            } else {
              callBack(403, { error: "Authontication failure!" });
            }
          });
        } else {
          callBack(500, { error: "There was a problem in the server side!" });
        }
      });
    } else {
      callBack(400, {
        error: "You must provide at least one filed to update!",
      });
    }
  } else {
    callBack(400, { error: "You have a problem in your request!" });
  }
};

// todo: authentication
handler._check.delete = (requestProperties, callBack) => {
  let { id } = requestProperties.queryStringObject;
  let { token } = requestProperties.headersObject;

  id = typeof id === "string" && id.trim().length === 20 ? id : null;

  if (id) {
    // lookup for the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const checkObject = parseJSON(checkData);
        // verify token
        token = typeof token === "string" ? token : false;

        _token.verify(token, checkObject.userPhone, (isValidToken) => {
          if (isValidToken) {
            data.delete("checks", id, (err) => {
              if (!err)
                data.read("users", checkObject.userPhone, (err, userData) => {
                  let userObject = parseJSON(userData);
                  if (!err && userObject) {
                    let userChecks =
                      typeof userObject.checks === "object" &&
                      userObject.checks instanceof Array
                        ? userObject.checks
                        : [];

                    if (userChecks.length > 0) {
                      // remove the deleted check id from user's checks
                      userObject.checks = userChecks.filter(
                        (check) => check !== id
                      );

                      data.update(
                        "users",
                        userObject.phone,
                        userObject,
                        (err) => {
                          if (!err) {
                            callBack(200, {
                              message: "Check was deleted successfully!",
                            });
                          } else {
                            callBack(500, {
                              error: "There was a problem in the server side!",
                            });
                          }
                        }
                      );
                    } else {
                      callBack(400, {
                        error:
                          "The check id that you trying to remove is not found!",
                      });
                    }
                  } else {
                    callBack(500, {
                      error: "There was a problem in the server side!",
                    });
                  }
                });
              else {
                callBack(500, {
                  error: "There was a problem in the server side!",
                });
              }
            });
          } else {
            callBack(500, { error: "Authencation failure!" });
          }
        });
      } else {
        callBack(500, { error: "There was a problem in the server side!" });
      }
    });
  } else {
    callBack(400, { error: "There was a problem in your request!" });
  }
};

module.exports = handler;
