const robot = require("robotjs");
const fs = require('fs');
const path = require('path');
const imageTools = require('./lib/imageTools');
const { runAction } = require('./lib/actions');
const phraseActions = require('./lib/phrasesActions');
const package = require('./package.json');
const photoshop = require('./lib/photoshop');
const { writeToLog } = require('./lib/logWriter');

const tempFolder = path.join(__dirname, 'temp');
const tempFilePath = path.join(tempFolder, 'activeWindow.png');

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


async function main() {
  try {
    const errorWindow = photoshop.getErrorWindow();

    // get a screenshot of active window. 
    if (errorWindow) {
      // bring error window to front
      errorWindow.bringToTop();
      // give a second to process that
      await delay(1000);
  
      const { x, y, width, height } = errorWindow.getBounds();
      const img = robot.screen.capture(x, y, width, height);
      // const img = robot.screen.capture();
      await imageTools.saveImage(img, tempFilePath);
      const ocrText = await imageTools.findText(tempFilePath);
  
      // append to log
      let logTxt = '\r\n*********** NEW ****************\r\n';
      logTxt += ocrText;
      writeToLog(logTxt, 'OCR_log');
      // run through all phrase actions to see if one matches
      let PA = null;
      for (let i = 0; i < phraseActions.length; i++) {
        for (let p = 0; p < phraseActions[i].phrases.length; p++) {
          const phrase = phraseActions[i].phrases[p];
          if (ocrText.toLowerCase().includes(phrase.toLowerCase())) {
            // we have a match. Put it in the actions
            PA = phraseActions[i];
          }
        }
      }
  
      // see if we need to run actions
      if (PA) {
        console.log('Running Action: ' + PA.name);
        try {
          errorWindow.bringToTop();
          await delay(500);
          await runAction(PA.actions);
        } catch (e) {
          console.log(e);
        }
      }
  
    } else {
      // console.log('Photoshop not active window');
    }
  } catch (e) {
    console.log('ERROR: ', e);
  }
  await delay(10000);
  main();
}

main();