const robot = require("robotjs");
const fs = require('fs');
const path = require('path');
const imageTools = require('./lib/imageTools');
const { runAction } = require('./lib/actions');
const phraseActions = require('./lib/phrasesActions');
const package = require('./package.json');
const photoshop = require('./lib/photoshop');
const { writeToLog } = require('./lib/logWriter');
const child_process = require('child_process');
const ErrorMonitor = require('./lib/ErrorMonitor');

const maxSecondsInError = 60; // false positives could be any dialog box including initial loading screen, keep in mind.
const errorMonitor = new ErrorMonitor();

const tempFolder = path.join(__dirname, 'temp');
const tempFilePath = path.join(tempFolder, 'activeWindow.png');

let photoshopPath = null;

// make the temp folder if it does not exist
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

console.log(`Photoshop Monitor v${package.version}\n`);

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms)
  })
}

const openPhotoShop = () => {
  try {
    child_process.exec(`"${photoshopPath}"`);
  }
  catch (error) {
    console.log('ERROR:', error)
  }
}

const closePhotoshop = () => {
  try {
    return child_process.execSync('taskkill /F /IM Photoshop.exe /T').toString();
  }
  catch (error) {
    console.log('ERROR:', error)
  }
}


async function main() {
  try {
    const errorWindow = photoshop.getErrorWindow();
    if (errorWindow) {
      // set photoshop path from owner
      photoshopPath = errorWindow.getOwner().path;
      errorMonitor.updateStatus(true);

      const secInError = errorMonitor.getSecondsInError();
      if (secInError > maxSecondsInError) {
        console.log('Error Detected. Force closing Photoshop.');
        console.log(closePhotoshop());
        errorMonitor.clear();

        if (photoshopPath) {
          await delay(1000);
          console.log('Reopening Photoshop');
          openPhotoShop();
        }
      }
    } else {
      errorMonitor.updateStatus(false);
    }

  } catch (e) {
    console.log('ERROR: ', e);
  }
  await delay(1000);
  main();
}

main();