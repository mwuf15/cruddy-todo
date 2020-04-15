const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, todoID) => {
    fs.writeFile(path.join(exports.dataDir, `${todoID}.txt`), text, (err) => {
      if (err) {
        throw ('error writing file');
      } else {
        callback(null, { id: todoID, text: text });
      }
    });

  });
};

//?readdir - fs method
//?basename - fs method

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
  });
};

//?first we will fs.readdir to get the id
//?then we will use fs.readFile to read the content of the specific id

exports.readOne = (id, callback) => {
  // console.log(`/${id}`)

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    // console.log(id)
    callback(null, {id: id, text: data});

  });

};

exports.update = (id, text, callback) => {

  fs.access(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error('File does not exist'));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        }
        callback(null, { id: id, text: text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
