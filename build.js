const { compile } = require('nexe');
const path = require('path');
const outputFolder = path.join(__dirname, 'build');
const fs = require('fs');
const fse = require('fs-extra');
const rimraf = require('rimraf');


const nativeModules = [
  'ref-napi',
  'ffi-napi',
  'robotjs',
  'iconv',
  'tesseract.js',
  'tesseract.js-core',
  'extract-file-icon',
  'node-window-manager'
];

const fixTesseract = () => {
  const str = `const { fork } = require('child_process');

  let debugPort = 9229;
  
  /**
   * spawnWorker
   *
   * @name spawnWorker
   * @function fork a new process in node
   * @access public
   */
  module.exports = ({ workerPath }) => {
    debugPort += 1;
    return fork(workerPath);
  };
  `;
  fs.writeFileSync(path.join(__dirname, 'node_modules', 'tesseract.js', 'src', 'worker', 'node', 'spawnWorker.js'), str, 'utf8');
}

const copyModules = () => {
  for(let i = 0; i < nativeModules.length; i++){
    fse.copySync(
      path.join(__dirname, 'node_modules', nativeModules[i]),
      path.join(outputFolder, 'node_modules', nativeModules[i])
    )
  }
} 

fixTesseract();
// remove output folder
rimraf(outputFolder, {}, () => {
  compile({
    input: './main',
    output: path.join(outputFolder, 'photoshop-monitor.exe'),
    target: 'windows-x64-14.15.3'
  }).then(() => {
    copyModules();
    // copy config
    fs.copyFileSync(
      path.join(__dirname, 'config.json'),
      path.join(outputFolder, 'config.json')
    )
    console.log('success')
  })
});