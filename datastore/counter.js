const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
// we should use our readCounter and writeCounter functions to rewrite this function in continuation passing style
// we should pass in a callback and an err and data as parameters
exports.getNextUniqueId = (callback) => {
  // first we read the file by invoking readCounter
  readCounter((err, fileData) => {
    callback(fileData);
    if (err) {
      throw err;
    } else {
      counter++;
      writeCounter(counter, (err, fileData) => {
        if (err) {
          throw err;
        } else {
          callback(err, fileData);
        }
      });
    }
  });
  // then we invoke writeCounter() on the file
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////
// the point of this page is to write the counter to the counter.txt file to store in local memory
// our goal is to make a file in a database and save it there
exports.counterFile = path.join(__dirname, 'counter.txt');

