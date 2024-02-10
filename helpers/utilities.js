/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// dependencies
const crypto = require("crypto");
const environments = require("./environments");

// module scarffolding
const utilities = {};

// parse json strin to object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

// create random string
utilities.createRandomString = (strLength) => {
  let length =
    typeof strLength === "number" && strLength === 20 ? strLength : false;
  let output = "";
  if (length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i <= length - 1; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomCharacter = characters.charAt(randomIndex);
      output += randomCharacter;
    }
  }

  return output;
};

// export module
module.exports = utilities;
