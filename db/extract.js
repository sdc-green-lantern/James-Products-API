const csv = require('csv-parser');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const extractDataAsync = (fileName, cb, done) => {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', async (data) => await cb(data) )
    .on('end', done)
}
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

module.exports = { extractData, extractDataAsync };
