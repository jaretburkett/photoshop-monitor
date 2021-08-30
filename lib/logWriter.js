const fs = require('fs');
const path = require('path');

const tempFolder = path.join(__dirname, '..', 'temp');

const writeToLog = (str, logName, maxLines = 500) => {
  const logPath = path.join(tempFolder, `${logName}.txt`);
  let logTxt = '';
    if(fs.existsSync(logPath)){
      logTxt = fs.readFileSync(logPath, 'utf8');
    }

    logTxt += str;
    logTxt += '\r\n';

    const logTxtArr = logTxt.split(/\r?\n/);
    // remove lines until we have desired amount
    while(true){
      if(logTxtArr.length > maxLines){
        logTxtArr.shift();
      } else {
        break;
      }
    }
    fs.writeFileSync(logPath, logTxtArr.join('\r\n'), 'utf8');
}

module.exports.writeToLog = writeToLog;