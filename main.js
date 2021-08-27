const activeWindow = require('active-win');
const robot = require("robotjs");
const fs = require('fs');
const path = require('path');
const imageTools = require('./lib/imageTools');
const {runAction} = require('./lib/actions');
const phraseActions = require('./lib/phrasesActions');

const tempFolder = path.join(__dirname, 'temp');
const tempFilePath = path.join(tempFolder, 'activeWindow.png');
const ocrLogPath = path.join(tempFolder, 'OCR_log.txt');

const maxOCRLogLines = 40;

// make the temp folder if it does not exist
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

console.log('**** Ready ****');


const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms)
  })
}


async function main() {
  // check active window
  const winInfo = await activeWindow();
  // console.log(winInfo);
  

  // get a screenshot of active window. 
  if (winInfo && winInfo.owner && winInfo.owner.name === "Photoshop.exe" && winInfo.bounds) {
    // if (winInfo.bounds) {
    const { x, y, width, height } = winInfo.bounds;
    const img = robot.screen.capture(x, y, width, height);
    // const img = robot.screen.capture();
    await imageTools.saveImage(img, tempFilePath);
    // console.log('Reading OCR for strings')
    const start = new Date()
    const ocrText = await imageTools.findText(tempFilePath);
    const stop = new Date()
    // console.log('OCR Text:', ocrText );
    // write text in ocr log
    let logTxt = '';
    if(fs.existsSync(ocrLogPath)){
      logTxt = fs.readFileSync(ocrLogPath, 'utf8');
    }

    // append to log text
    logTxt += '\r\n \r\n*********** NEW ****************\r\n';
    logTxt += ocrText;

    const logTxtArr = logTxt.split(/\r?\n/);
    // remove lines until we have desired amount
    while(true){
      if(logTxtArr.length > maxOCRLogLines){
        logTxtArr.shift();
      } else {
        break;
      }
    }
    fs.writeFileSync(ocrLogPath, logTxtArr.join('\r\n'), 'utf8');
    // console.log(`OCR took ${(stop - start)/1000} seconds`)
    // run through all phrase actions to see if one matches
    let PA = null;
    for(let i = 0; i < phraseActions.length; i++){
      for(let p = 0; p < phraseActions[i].phrases.length; p++){
        const phrase = phraseActions[i].phrases[p];
        if(ocrText.toLowerCase().includes(phrase.toLowerCase())){
          // we have a match. Put it in the actions
          PA = phraseActions[i];
        }
      }
    }
    
    // see if we need to run actions
    if(PA){
      console.log('Running Action: ' + PA.name);
      await runAction(PA.actions);
    }

  } else {
    // console.log('Photoshop not active window');
  }

  await delay(10000);

  main();
}

main();