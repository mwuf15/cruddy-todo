const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const sprintf = require('sprintf-js').sprintf;

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(null, 0);
    } else {
      var dataFile = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(dataFile, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  // invoke read directory, translate to utf8, data is an array of filenames in data directory
  fs.readdir(exports.dataDir, 'utf8', (err, data) => {
    if (err) {
      callback(null, data);
    } else {
      // map over the data files and create a new array without file extension
      // change id from filename to id
      var mappedData = _.map(data, (text, id) => {
        //
        var text = text.replace('.txt', '');
        var id = path.basename(text, '.txt');
        return {id, text};
      });
      callback(null, mappedData);
    }
  });
  // var data = _.map(items, (text, id) => {
  // return { id, text };
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
