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

const errorMonitor = new ErrorMonitor();

const tempFolder = path.join(__dirname, 'temp');
const tempFilePath = path.join(tempFolder, 'activeWindow.png');

let photoshopPath = null;

// make the temp folder if it does not exist
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

console.log(`Photoshop Monitor v${package.version}\n`);

const config = require('./lib/config');
const maxSecondsInError = config.maxSecondsInError;
const errorActions = config.errorActions;

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms)
  })
}

const runConfigAction = async (action) => {
  try {
    console.log(`Running action: ${action.name}`);
    const cmd = action.cmd.split('{photoshopPath}').join(photoshopPath);
    if(action.sync){
      return child_process.execSync(cmd).toString();
    } else {
      child_process.exec(cmd);
    }
  } catch(e) {
    console.log('ERROR:', e)
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
        console.log('Error Detected. Running Actions');
        for(let i = 0; i < errorActions.length; i++){
          await runConfigAction(errorActions[i]);
          await delay(1000);
        }
        errorMonitor.clear();
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