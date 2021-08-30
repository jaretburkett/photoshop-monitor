
const { writeToLog } = require('./logWriter');
const { windowManager } = require('node-window-manager');

/**
 *  Tried to find an error window based on it's footprint and retuens it if it is there
 * @returns null | Window
 */
const getErrorWindow = () => {
  const windows = windowManager.getWindows();
  let errorWindow = null;
  const clenWindows = windows.map(w => { return {title:w.getTitle(), bounds: w.getBounds(), owner: w.getOwner()} });
  writeToLog(JSON.stringify(clenWindows), 'open_windows.log', 50);
  for(let i = 0; i < windows.length; i++){
    const win = windows[i];
    if(win.getTitle().includes('Adobe Photoshop') && !(win.getTitle().includes('node.exe'))) {
      // photoshop windows
      // console.log({
      //   title: win.getTitle(),
      //   bounds: win.getBounds(),
      //   isWindow: win.isWindow(),
      //   owner: win.getOwner(),
      // })
      // photoshop errors will have owner information since photoshop owns the error
      if(win.getOwner().path.includes('Photoshop.exe')){
        errorWindow = win;
      }
    }
  }
  return errorWindow;
}

module.exports.getErrorWindow = getErrorWindow;

// test module
if (typeof require !== 'undefined' && require.main === module) {
  const errorWin = getErrorWindow();
  if(errorWin){
    console.log('Found error window and brought to front. ');
    errorWin.bringToTop();
  }
}