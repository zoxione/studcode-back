const fs = require('fs');
const csv = require('csv');
require('dotenv').config({
  path: '.env.development',
});

const educations = [];
const file = './src/modules/educations/utils/data.csv';

fs.createReadStream(file)
  .pipe(csv.parse({ columns: true }))
  .on('data', (education) => {
    educations.push(education);
  })
  .on('end', async () => {
    educations.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    const csvStringifier = csv.stringify(educations, { header: true, quoted: true });
    const writeStream = fs.createWriteStream(file);
    csvStringifier.pipe(writeStream);
    writeStream.on('error', (error) => {
      console.error('Error writing to file:', error);
    });
    writeStream.on('finish', () => {
      console.log('CSV file written successfully.');
    });
  });
