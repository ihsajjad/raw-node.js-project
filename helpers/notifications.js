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
// const twilioClient = require("twilio")(twilio.accountSid, twilio.authToken);

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
      from: twilio.From,
      to: `+880 ${userPhone}`,
      body: userMsg,
    };

    // stringify the payload
    const stringifyPayload = queryString.stringify(payload);

    //   configure the request details
    // twilioClient.messages
    //   .create(payload)
    //   .then((message) => console.log(message));
    console.log(twilio.AccountSid);
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.AccountSid}/Messages.json`,
      auth: `${twilio.AccountSid}:${twilio.AuthToken}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    //   instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // console.log(res);
      //   get the status of the sent request
      const status = res.statusCode;
      //   callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(true);
      } else {
        callback(`Status code returned was ${false}`);
      }
    });

    req.on("error", (err) => {
      callback(err);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameter were missing or invalid!");
  }
};

module.exports = notifications;
