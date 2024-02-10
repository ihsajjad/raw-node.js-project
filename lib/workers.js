/*
 * Title: Worker library
 * Description: Worker related file
 * Author: Iftekher Hossen Sajjad
 * Date: 10/2/2024
 *
 */

// dependencies
const { parseJSON } = require("../helpers/utilities");
const { check } = require("../routes");
const data = require("./data");
const url = require("url");
const http = require("http");
const https = require("https");

// worker object - module scaffolding
const worker = {};

// look up all the checks
worker.getherAllChecks = () => {
  // get all the checks
  data.list("checks", (err, checkNames) => {
    if (!err && checkNames && checkNames.length > 0) {
      checkNames.forEach((checkName) => {
        // read the individual check data
        data.read("checks", checkName, (err, checkData) => {
          if (!err && checkData) {
            let checkObject = parseJSON(checkData);
            // pass the data to the check validator
            worker.validateCheckData(checkObject);
          } else {
            console.log("Error: could not found check data!");
          }
        });
      });
    } else {
      console.log("Error: could not found any check to process!");
    }
  });
};

// validate individual checkdata
worker.validateCheckData = (checkObject) => {
  if (checkObject && checkObject?.id) {
    let check = checkObject;
    check.state =
      typeof check.state === "string" && ["up", "down"].includes(check.state)
        ? check.state
        : "down";

    check.lastChecked =
      typeof check.lastChecked === "number" && check.lastChecked > 0
        ? check.lastChecked
        : false;

    //   pass to the next process
    worker.perfomCheck(check);
  } else {
    console.log("Error: check was invalid or not properly formated!");
  }
};

// perfom check for individual check
worker.perfomCheck = (check) => {
  // prepare the initial outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  // mark the outcome has not been sent yet
  let outComeSent = false;

  const { protocol, method, timeoutSeconds } = check;
  // parse the host name and the full url from original data
  const parsedUrl = url.parse(`${protocol}://${check.url}`, true);
  const { hostname, path } = parsedUrl;

  // construct the request
  const requestDetails = {
    protocol: `${protocol}:`,
    hostname,
    method: method.toUpperCase(),
    path,
    timeout: timeoutSeconds * 1000,
  };

  const protocolToUse = protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    // grab the status of the response

    const status = res.statusCode;

    // update the check outcome and parse to the next process
    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutcome(check, checkOutCome);
      checkOutCome = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };

    // update the check outcome and parse to the next process
    if (!outComeSent) {
      worker.processCheckOutcome(check, checkOutCome);
      checkOutCome = true;
    }
  });

  req.on("timeout", () => {
    checkOutCome = {
      error: true,
      value: "timeout",
    };

    // update the check outcome and parse to the next process
    if (!outComeSent) {
      worker.processCheckOutcome(check, checkOutCome);
      checkOutCome = true;
    }
  });

  req.end();
};

// save to the database
worker.processCheckOutcome = (check, checkOutCome) => {
  const { error, responseCode } = checkOutCome;
  const { successCodes, lastChecked, state } = check;
  // check if checkOutcome is up or down
  let newState =
    !error && responseCode && successCodes.includes(responseCode)
      ? "up"
      : "down";

  // decide weather we should alert the user or not
  let alertWanted = lastChecked && state !== newState ? true : false;

  // update the check data
  let newCheck = { ...check };

  newCheck.state = newState;

  newCheck.lastChecked = Date.now();

  // update the check to disk
  data.update("checks", newCheck.id, newCheck, (err) => {
    if (!err) {
      // send the check data to the next proces
      if (alertWanted) worker.alertUserToStatusChange(newCheck);
      else console.log("Alert is not needed");
    } else {
      console.log("Error: while trying to update data!");
    }
  });
};

// send notifications sms to user if state changes
worker.alertUserToStatusChange = (newCheck) => {
  const { protocol, method, state, url } = newCheck;

  const msg = `Alert: Your check for ${method.toUpperCase()} ${protocol}://${url} is currently ${state}`;
  console.log(msg);
  // todo: send sms to the user using twilio sms.
};

// timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.getherAllChecks();
  }, 300 * 60);
};

// start the workers
worker.init = () => {
  // execute all the checks for the first time
  worker.getherAllChecks();

  // call the loop so that checks continue
  worker.loop();
};

// export the module
module.exports = worker;
