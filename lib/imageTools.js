const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const tesseract = require('tesseract.js');

let worker = null;

module.exports.saveImage = (robotScreenPic, path) => {
  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
      let pos = 0;
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        /* eslint-disable no-plusplus */
        image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
        image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
        /* eslint-enable no-plusplus */
      });
      
      image.write(path);
      resolve(image);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

module.exports.saveCanvas = (canvas, path) => {
  return new Promise(resolve => {
    const out = fs.createWriteStream(path);
    const stream = canvas.createPNGStream();
    stream.pipe(out)
    out.on('finish', resolve)
  });
}

module.exports.findText = async (path) => {

  return new Promise(resolve => {
    tesseract.recognize(
      path,
      'eng',
      { logger: m => null }
    ).then(({ data: { text } }) => {
      resolve(text)
    })
  });
}

