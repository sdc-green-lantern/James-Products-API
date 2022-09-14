const csv = require('csv-parser');
const fs = require('fs');

const extractData = (fileName, loadData) => {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', loadData))
    .on('end', () => console.log(`finished loading ${fileName}`))
}

module.exports = extractData;
