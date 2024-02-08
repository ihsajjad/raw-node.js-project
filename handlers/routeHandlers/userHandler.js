/*
 * Title: User Handler
 * Description: Handler to handle user related route
 * Author: Iftekher Hossen Sajjad
 * Date: 8/2/2024
 */

// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");

// moduler scaffolding
const handler = {};

handler.userHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callBack) => {
  let { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;

  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : null;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : null;

  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : null;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : null;

  tosAgreement =
    typeof tosAgreement === "boolean" && tosAgreement === true
      ? tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //   make sure that the user doesn't already exists
    data.read("users", phone, (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        //   store the user to db
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callBack(200, { message: "User was created successfully!" });
          } else {
            callBack(500, {
              error: "Could not create user!",
            });
          }
        });
      } else {
        callBack(500, { error: "There is an error in the server side!" });
      }
    });
  } else {
    callBack(400, { error: "You have a problem in your request." });
  }
};

// todo: authentication
handler._users.get = (requestProperties, callBack) => {
  let { phone } = requestProperties.queryStringObject;

  // check the phone number if valid
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : null;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err, data) => {
      const user = { ...parseJSON(data) };

      if (!err && data) {
        delete user.password;
        callBack(200, user);
      } else {
        callBack(404, { error: "Requested user was not found!" });
      }
    });
  } else {
    callBack(404, { error: "Requested user was not found!" });
  }
};

// todo: authentication
handler._users.put = (requestProperties, callBack) => {
  let { firstName, lastName, phone, password } = requestProperties.body;

  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : null;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : null;

  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : null;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      // lookup the user
      data.read("users", phone, (err, userData) => {
        const user = { ...parseJSON(userData) };

        if (!err) {
          if (firstName) user.firstName = firstName;
          if (lastName) user.lastName = lastName;
          if (password) user.password = hash(password);

          // store to database
          data.update("users", phone, user, (err) => {
            if (!err) {
              callBack(200, { message: "User was updated succesfully." });
            } else {
              callBack(500, {
                message: "There was a problem in the server, Please try again!",
              });
            }
          });
        } else {
          callBack(400, { error: "Invalid phone number, Please try again!" });
        }
      });
    } else {
      callBack(400, { error: "You had a bad request!" });
    }
  } else {
    callBack(400, { error: "Invalid phone number, Please try again!" });
  }
};

// todo: authentication
handler._users.delete = (requestProperties, callBack) => {
  let { phone } = requestProperties.queryStringObject;

  // check the phone number if valid
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : null;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err, userData) => {
          if (!err) {
            callBack(200, { error: "User was deleted successfully." });
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

module.exports = handler;
