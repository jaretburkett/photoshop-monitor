const robot = require("robotjs");

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms)
  })
}


module.exports.runAction = async (actionArr) => {
  for(let i = 0; i < actionArr.length; i++){
    robot.keyToggle(actionArr[i], 'down');
    await delay(200);
    robot.keyToggle(actionArr[i], 'up');
    await delay(1000);
  }
}