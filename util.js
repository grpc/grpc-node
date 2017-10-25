const path = require('path');
const del = require('del');
const fs = require('fs');
const makeDir = require('make-dir');

// synchronously link a module
const linkSync = (base, from, to) => {
  from = path.resolve(base, from);
  to = path.resolve(base, to);
  try {
    fs.lstatSync(from);
    console.log('link: deleting', from);
    del.sync(from);
  } catch (e) {
    makeDir.sync(path.dirname(from));
  }
  console.log('link: linking', from, '->', to);
  fs.symlinkSync(to, from, 'junction');
};

module.exports = {
  linkSync
};