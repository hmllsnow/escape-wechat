const WechatyBotService = require('../controller/WechatyBotController');
const ParentProcess = require('./ApiService');



// // 假设你的微信机器人脚本位于 'path/to/your/bot/demo.js'
// const botService = new WechatyBotService('D:/demo');
// let pid = ''
// // 启动微信机器人
// botService.startBot()
//   .then((processInfo) => {
//     console.log('Bot started with PID:', processInfo.pid);
//     return botService.stopBot(processInfo.pid);
//   })
//   .then((stopResult) => {
//     console.log('Bot stopped:', stopResult);
//     return botService.startBot(); // 重启微信机器人
//   })
//   .then((newProcessInfo) => {
//     console.log('Bot restarted with new PID:', newProcessInfo.pid);
//   })
//   .catch((error) => {
//     console.error('An error occurred:', error);
//   });


function asyncOperation(callback) {
  setTimeout(() => {
    const result = 'Async Result';
    callback(result);
  }, 1000);
}

function getResult() {
   asyncOperation(result => {
    console.log('Inside callback:', result);
    return result; // 这里的返回值不会被 getResult 方法捕获
  });
  return '你好傻逼'
}
let result = getResult();


console.log('Outside:', result); // 输出 undefined