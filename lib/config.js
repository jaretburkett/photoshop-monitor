const fs = require('fs');
const path = require('path');

// {photoshopPath} =  path to photoshop
const defaultConfig = {
  errorActions: [
    {
      name: "Killing Photoshop",
      sync: true,
      cmd: "taskkill /F /IM Photoshop.exe /T"
    },
    {
      name: "Restarting Photoshop",
      sync: false,
      cmd: "\"{photoshopPath}\""
    },
  ],
  maxSecondsInError: 60
};
const configPath = path.join(__dirname, '..', 'config.json');

let config = JSON.parse(JSON.stringify(defaultConfig));


if(fs.existsSync(configPath)){
  console.log('Loading config file.');
  try {
    let loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    // overwrite with custom config
    for(let key in loadedConfig){
      config[key] = loadedConfig[key];
    }
    console.log('Config loaded.');
  } catch (e) {
    console.log('Error loading config');
    console.log(e);
  }
} else {
  console.log('No config file found. Using default');
}
console.log(`config: ${JSON.stringify(config)}`)

module.exports = config;