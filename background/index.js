const ApiService = require('./service/ApiService');
const WechatyBotController = require('./controller/WechatyBotController');

const config = require('./config');
const fs = require('fs');
const path = require('path');
const botPath = path.join(__dirname, '../bot');//注意botPath可能在其他地方被初始化
const apiService = new ApiService(config.api.port);

console.log('调用前botPath:',botPath)

const wechatyBot = new WechatyBotController(botPath);


apiService.start();
let botpid;
console.log(`botpid[${botpid}]`)
// wechatyBot.startBot()
// .then((data) => {
//     console.log('Bot started with PID:', data.pid);
//     //botpid = wechatyBot.botProcess.pid
//     botpid = data.pid;
//   })
// .catch((error) => {
//     console.error('An error occurred:', error);
// });


/*
测试发现，主进程的sigint指令会传给子进程，他的优先级可能会高于stopbot（）方法给子进程发sigterm指令


process.on('SIGINT', () => {
    console.log('接收到停止指令');
    console.log(`botpid[${botpid}]`)
    if(botpid!==undefined){
        console.log('Bot is running.');
        wechatyBot.stopBot(botpid)
        .then(() => {
            console.log('Bot stopped.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('An error occurred:', error);
            process.exit(1);
        })
        ;
    }
    //WechatyBotController.stopBot(botpid);
});
  
*/