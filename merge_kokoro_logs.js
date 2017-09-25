const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

const rootDir = __dirname;

readDir(rootDir + '/reports')
    .then((dirNames) =>
          Promise.all(dirNames.map((dirName) =>
                                   readDir(path.resolve(rootDir, 'reports', dirName))
                                   .then((fileNames) =>
                                         Promise.all(fileNames.map((name) =>
                                                                   readFile(path.resolve(rootDir, 'reports', dirName, name))
                                                                   .then((content) => {
                                                                     let parser = new xml2js.Parser();
                                                                     const parseString = util.promisify(parser.parseString.bind(parser));
                                                                     return parseString(content);
                                                                   })
                                                                  ))
                                        )
                                   .then((objects) => {
                                     let merged = objects[0];
                                     merged.testsuites.testsuite = Array.prototype.concat.apply([], objects.map((obj) => obj.testsuites.testsuite));
                                     let builder = new xml2js.Builder();
                                     let xml = builder.buildObject(merged);
                                     let resultName = path.resolve(rootDir, 'reports', dirName, 'sponge_log.xml');
                                     console.log(`Writing ${resultName}`);
                                     return writeFile(resultName, xml);
                                   })
                                  ))
         )
    .catch((error) => {
      console.error(error);
    });
