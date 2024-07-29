//import { WechatyBuilder} from "wechaty"
import qrcodeTerminal from 'qrcode-terminal'; 
import { log } from 'wechaty'
import { config } from './config.js'
import { onMessage } from './handlersNew/onMessage.js'
import { registerHandlers } from './handlersNew/bot_handlers.js';
import * as handlers from './handlersNew/bot_handlers.js'; // 导入所有处理函数
import fs  from 'fs';
import path from 'path';
import axios from 'axios';
import os from 'os';
// 获取当前模块的完整 URL
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import moment from 'moment';
import { configParser } from './Utils.js';
import IPCServer from './ipc/IPCServer.js';
import { time } from 'console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function cleanupSockFiles() {
  let tempDir = '';
  console.log('cleanupSockFiles-->进入sock清理函数');
  // 判断运行环境
  if (process.env.DOCKER_ENV === 'true') {
    // 在 Docker 容器中运行
    console.log('cleanupSockFiles-->目前运行环境是docker');
    tempDir = '/tmp';
  } else {
    // 直接在操作系统上运行
    tempDir = os.tmpdir();
  }

  try {
    // 读取临时目录中的文件
    const files = fs.readdirSync(tempDir);

    // 过滤出 .sock 文件
    const sockFiles = files.filter(file => path.extname(file) === '.sock');
    if (sockFiles.length === 0) {
      console.log('cleanupSockFiles-->没有找到 .sock 文件');
    }
    // 删除 .sock 文件
    sockFiles.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.unlinkSync(filePath);
      console.log('cleanupSockFiles-->已删除文件:', filePath);
    });
  } catch (err) {
    console.error('cleanupSockFiles-->清理 .sock 文件时出错:', err);
  }
  console.log('cleanupSockFiles-->清理函数结束');
}



// 捕获全局异常
process
  .on('uncaughtException', onWechatyError)
  .on('SIGTERM', () => {
    console.log('Received SIGTERM signal, closing child process...');
  // 执行必要的清理操作
    console.log('接收到 SIGTERM 信号，正在清理 .sock 文件...');
    cleanupSockFiles();
    console.log('接收到 SIGTERM 信号，已完成清理 .sock 文件');
    process.exit(0);
  })
  .on('SIGINT', () => {
    console.log('Received SIGINT signal, closing child process...');
    console.log('接收到 SIGINT 信号，正在清理 .sock 文件...');
    cleanupSockFiles();
    console.log('接收到 SIGINT 信号，已完成清理 .sock 文件');
    process.exit(0);
  })
  //.on('exit', cleanupSockFiles);

const logDirectory = path.resolve(__dirname, './logs');

console.log(logDirectory);
const logFileName = 'app.log';
const maxLogSize = 5 * 1024 * 1024; // 日志文件最大5MB
const maxBackupFiles = 10;
// 保存原始的 console.log 函数
const originalConsoleLog = console.log;

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 创建一个可写流到日志文件
let logStream = fs.createWriteStream(path.join(logDirectory, logFileName), { flags: 'a' });

// 检查日志文件大小，如果超过限制，则备份并创建新的日志文件
function checkLogFileSize() {
  const logFilePath = path.join(logDirectory, logFileName);
  if (fs.existsSync(logFilePath)) {
    const fileSize = fs.statSync(logFilePath).size;
    if (fileSize > maxLogSize) {
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const backupFileName = `appbak${timestamp}.log`;
      const backupFilePath = path.join(logDirectory, backupFileName);
      fs.renameSync(logFilePath, backupFilePath);
      console.log(`日志文件已备份为 ${backupFileName}`);
      cleanupBackupFiles();
      // 关闭当前的写入流
      logStream.end();
      // 创建一个新的写入流到新的日志文件
      logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    }
  }
}

// 清理多余的备份文件
function cleanupBackupFiles() {
  const backupFiles = fs.readdirSync(logDirectory).filter(file => file.startsWith('appbak'));
  if (backupFiles.length > maxBackupFiles) {
    backupFiles.sort((a, b) => fs.statSync(path.join(logDirectory, b)).mtime.getTime() - fs.statSync(path.join(logDirectory, a)).mtime.getTime());
    const filesToDelete = backupFiles.slice(maxBackupFiles);
    filesToDelete.forEach(file => {
      const filePath = path.join(logDirectory, file);
      fs.unlinkSync(filePath);
      console.log(`已删除多余的备份文件 ${file}`);
    });
  }
}



// 重写 console.log 来同时输出到控制台和文件
console.log = function (message,message2) {
  const now = moment();
  const isoString = now.format('YYYY-MM-DDTHH:mm:ss');
  if(!message2){
    message2=''
  }
  logStream.write(`${isoString} - ${message}${message2}\n`);
  originalConsoleLog(message+message2);
  checkLogFileSize();//检查日志文件大小
};

// 定义全局变量
let bot;
// 定义错误处理函数
async function onWechatyError(error) {
  console.log('出错，但仍然可用:'+ error)
  // 这里可以尝试重启Wechaty或者执行其他恢复操作
  //await bot.logout()
  // 可以选择重新启动Wechaty
  // await bot.start()
  // 或者退出程序
  //process.exit(1)
}




// 通过 API 接口上传数据
const url = 'http://localhost:3000/api/bot';
async function uploadData(data) {
  try {
    await axios.post(url+'/qrcodeupload', data);
    console.log('数据上传成功');
  } catch (error) {
    console.error('数据上传失败:', error.message);
  }
}
async function uploadLogout(data) {
  try {
    await axios.post(url+'/logout', data);
    console.log('数据上传成功');
  } catch (error) {
    console.error('数据上传失败:', error.message);
  }
}
async function uploadLogin(data) {
  try {
    await axios.post(url+'/login', data);
    console.log('数据上传成功');
  } catch (error) {
    console.error('数据上传失败:', error.message);
  }
}
async function getConfig(){
  try {
    const response = await axios.get('http://localhost:3000/api/config', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    if (response.data.code === 200) {
      console.log('获取配置成功:', response.data.data);
      return response.data.data;
    }
    else {
      console.error('获取配置报错:', response);
      return config;
      throw new Error('获取配置失败'+response);
      
    }
  } catch (error) {
    console.error('获取配置出错:', error);
    console.log('获取配置失败，使用默认配置'+config.toString());
    return config;

    //throw new Error('获取配置出错'+error);
    
  }
}


async function main (){
    //const bot = WechatyBuilder.build()
    //为解决1250的错误而加的
    console.log('代码修改时间2024-07-11 23:07');
    process.env['WECHATY_LOG'] = 'error'
    let config = await getConfig();
    configParser(config);
    console.log('api get config=',config);

    const { WechatyBuilder } = await import('wechaty');
    const buildTimestamp = Date.parse(new Date())
    bot = WechatyBuilder.build({
      puppetOptions: {
        cache: true,
      //  uos: true,
      },
      name:'hml',
     //puppet: 'wechaty-puppet-wechat',
    });
    log.level('verbose');
    // 注册处理函数到 bot 实例
    await registerHandlers(bot);

    bot
      .on('scan', (qrcode, status) => {
        console.log('Bot started');
        console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`);
        qrcodeTerminal.generate(qrcode, { small: true },(qrt)=>{
          //第一行输出时加上/n
          qrt = '=======》 扫码登录 《=======\n'+qrt;
          if(qrt){
            console.log(qrt);
          }
        });
        console.log('Bot started');
        const data = {
          qrcode: qrcode,
          status: status,
          emit: 'scan'
        };
        uploadData(data)
      })
      .on('login',            async(user) => 
        {console.log(`User ${user} logged in`)
          const data = {
            user: user,
            emit: 'login'
          };
          uploadLogin(data)
          IPCServer(bot)
          //const targetContact1 = await bot.Contact.find({ alias: "别名" });
        })
      .on('message',      async (message) => {
        let msgTimestamp = Date.parse(message.date())
        if(msgTimestamp - buildTimestamp > 1000) {//增加处理缓存数据重复发送的问题
          onMessage(bot, message, config)
        }
        
      })
      .on('logout',           user => {
        console.log(`User ${user} logged out`)
        const data = {
          user: user,
          emit: 'logout'
        };
        uploadLogout(data)
        })
      .on('heartbeat',  heartbeat => console.log(`------------<<<<>>>>>>-----------Bot received heartbeat: ${heartbeat}`))
      .on('error', error => console.log('捕捉到🐛，如果还能正常运行，可以忽略', error)) 
    await bot.start()
  }
  
  


  main()
    .catch(console.error)