import base64Image from 'base64-img';

module.exports = {
  formats: {
    jpeg: base64Image.base64Sync(`${__dirname}/download.jpeg`),
    png: base64Image.base64Sync(`${__dirname}/512px-Test.svg.png`),
  },
};
