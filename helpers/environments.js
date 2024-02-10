/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Iftekher Hossen Sajjad
 * Date: 6/2/2024
 */

// module scarffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "bhyujiksdgfhnsf",
  maxChecks: 5,
  twilio: {
    from: "+16593365002",
    accountSid: "ACef1d5b2c491e47081416466a09b9b767",
    authToken: "2a616b2b32de3349f52f27bb304a46b7",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "iuytfvbnvgbuyhj",
  maxChecks: 5,
  twilio: {
    from: "+16593365002",
    accountSid: "ACef1d5b2c491e47081416466a09b9b767",
    authToken: "2a616b2b32de3349f52f27bb304a46b7",
  },
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//   export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
