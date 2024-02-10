/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Iftekher Hossen Sajjad
 * Date: 10/2/2024
 */

// dependencies
const https = require("https");
const { twilio } = require("./environments");
const queryString = require("querystring");
const twilioClient = require("twilio")(twilio.accountSid, twilio.authToken);

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
  // input validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" && msg.trim().length <= 1600 ? msg.trim() : false;

  if (userPhone && userMsg) {
    //   configure the request payload
    const payload = {
      from: twilio.from,
      to: `+880 ${userPhone}`,
      body: userMsg,
    };

    // stringify the payload
    const stringifyPayload = queryString.stringify(payload);

    //   configure the request details
    // twilioClient.messages
    //   .create(payload)
    //   .then((message) => console.log(message));

    callback(true);
  } else {
    callback("Given parameter were missing or invalid!");
  }
};

module.exports = notifications;
