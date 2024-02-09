// dependencies
const fs = require("fs");
const path = require("path");

// module scarffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname + "/../.data/");

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //   convert data to string
      const stringData = JSON.stringify(data);

      // write data to file and then close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) callback(false);
            else {
              callback("Error closing the new file!");
            }
          });
        } else {
          callback("Error writing to new file!");
        }
      });
    } else {
      callback("Could not create new file, it may already exists!");
    }
  });
};

// write data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir}${dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

// update data to the file
lib.update = (dir, file, data, callback) => {
  console.log(dir, file);
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // writing to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Failed to closing the file!");
                }
              });
            } else {
              callback("Error writing to file");
            }
          });
        } else {
          callback("Error truncating file!");
        }
      });
    } else {
      callback("Error updating file, File may not exists");
    }
  });
};

// delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.basedir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Failed to delete the file!");
    }
  });
};

module.exports = lib;
