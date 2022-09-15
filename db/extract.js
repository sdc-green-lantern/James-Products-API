// const csv = require('csv-parser');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

/*
const extractData = (fileName, cb) => {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', cb)
    .on('end', () => console.log(`finished loading ${fileName}`))
}
*/
const extractData = (filename) => {
  const results = [];
  const data = fs.readFileSync(filename).toString()
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach((record) => results.push(record));
  return results;
};

module.exports = extractData;
