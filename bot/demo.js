//import { WechatyBuilder} from "wechaty"
import qrcodeTerminal from 'qrcode-terminal'; 
import { log } from 'wechaty'
import { config } from './config.js'
import { onMessage } from './handlers/onMessage.js'
//import { greet, replyKeyword, provideHelp } from './handlers/bot_handlers.js'
import { registerHandlers } from './handlers/bot_handlers.js';
import * as handlers from './handlers/bot_handlers.js'; // 导入所有处理函数
import fs  from 'fs';
import path from 'path';
import EventEmitter from 'events';
import axios from 'axios';
// 获取当前模块的完整 URL
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import moment from 'moment';
import { configParser } from './Utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 捕获全局异常
process
  .on('uncaughtException', onWechatyError)
  .on('SIGTERM', () => {
    console.log('Received SIGTERM signal, closing child process...');
  // 执行必要的清理操作
  // ...
    process.exit(0);
  })
  .on('SIGINT', () => {
    console.log('Received SIGINT signal, closing child process...');
  // 执行必要的清理操作
  // ...
    process.exit(0);
  })







const logDirectory = path.resolve(__dirname, './logs');

console.log(logDirectory);
const logFileName = 'app.log';
// 保存原始的 console.log 函数
const originalConsoleLog = console.log;

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 创建一个可写流到日志文件
const logStream = fs.createWriteStream(path.join(logDirectory, logFileName), { flags: 'a' });

// 重写 console.log 来同时输出到控制台和文件
console.log = function (message) {


const now = moment();
const isoString = now.format('YYYY-MM-DDTHH:mm:ss');
  logStream.write(`${isoString} - ${message}\n`);
  originalConsoleLog(message);
};




/*


async function onMessage(msg){
    if(msg.text()=="ding"){
        await msg.say("dong");
    }
    const text = msg.text();
  const room = msg.room();
  // 如果消息文本匹配你想要的指定群聊名称（替换成你的群聊名称）
 
  //&& await room.topic() === '咱们仨'
  if (text === '#获取群成员' ) {
    const members = await room.memberList();
    let memberList = [];
    for (let member of members) {
      const alias = await room.alias(member) || member.name(); // 获取群内alias，如果没有alias，则用微信名
      memberList.push(alias);
    }
    const namesString = memberList.join(', ');
    console.log(`群成员列表: ${namesString}`);
    await room.say(`群成员列表: ${namesString}`);
  }
}
*/
// 定义全局变量
let bot;
// 定义错误处理函数
async function onWechatyError(error) {
  console.log('出错，但仍然可用:', error)
  // 这里可以尝试重启Wechaty或者执行其他恢复操作
  //await bot.logout()
  // 可以选择重新启动Wechaty
  // await bot.start()
  // 或者退出程序
  //process.exit(1)
}

const targetRoomNames = ['咱们仨', '群聊名称 2']; // 替换为实际的群聊名称
const targetContactNames = ['LL', '联系人微信名 2']; // 替换为实际的联系人微信名
const forwardToContactName = 'LL'; // 替换为要转发消息的联系人微信名

async function onMessage1(bot,message) {
  console.log('进来了')
  log.info('进来了')
  let content = '';
  const receiver = message.to()

  const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
  content = message.text() 
  const receiverName = receiver?.name()
  console.log('hml----原始content=',content);
  content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
  //console.log(`hml----content=${content}`);
  console.log('hml----content=',content);
  if(message.text()=="ding"){
    console.error('进来了');
    await message.say("dong");
  }


  const room = message.room();
  const contact = message.talker();
  

  if(room){

    const roomname= await room.topic();
    const talkername = contact.name();
    console.log(`roomtopic：[${roomname}]联系人name：${talkername}`);
    if (targetRoomNames.includes(roomname) && targetContactNames.includes(talkername)) {
      console.log(`条件正常`);
      const forwardToContact = await bot.Contact.find({ name: config.king });
      console.log(`联系人正常`);
      console.log(`Received message: ${message.toString()}`); // 添加这行来打印原始消息
      const text = message.text();
      console.log(`Text extracted: ${text}`); 
      if (forwardToContact) {
        // 转发消息
        switch (message.type()) {
          case bot.Message.Type.Text:
            // 文字消息
            let text = message.text();
            console.log(`文本[${text}]`);
            //text = text.replace(/:/g, "\\:");

            //await forwardToContact.say(`Message from ${talkername} in ${roomname}: "${text}"`);
            switch (talkername){
              case config.teacherChinese:
                await forwardToContact.say(`尊贵的班主任说: "${text}"`);
                break;
              case config.teacherMaths:
                await forwardToContact.say(`数学老师说: "${text}"`);
                break;
              case config.teacherEnglish:
                await forwardToContact.say(`英语老师说: "${text}"`);
                break;
              default:
                await forwardToContact.say(`暂时迷路的消息：[${talkername}]在[${roomname}]群里说: "${text}"`);
                break;
            }
            
            break;
          case bot.Message.Type.Image:
            // 图片消息
            const image = await message.toFileBox();
            await forwardToContact.say(`Image from ${talkername} in ${roomname}:`);
            await forwardToContact.say(image);
            switch (talkername){
              case config.teacherChinese:
                await forwardToContact.say(`尊贵的班主任发图了:`);
                await forwardToContact.say(image);
                break;
              case config.teacherMaths:
                await forwardToContact.say(`数学老师发图了:`);
                await forwardToContact.say(image);
                break;
              case config.teacherEnglish:
                await forwardToContact.say(`英语老师发图了:`);
                await forwardToContact.say(image);
                break;
              default:
                await forwardToContact.say(`暂时迷路的人发图了:`);
                await forwardToContact.say(image);
                break;
            }


            break;
          case bot.Message.Type.Audio:
            // 语音消息
            const audio = await message.toFileBox();
            await forwardToContact.say(`Audio from ${talkername} in ${roomname}:`);
            await forwardToContact.say(audio);
            break;
          case bot.Message.Type.Attachment:
            // 文件消息
            const attachment = await message.toFileBox();

            switch (talkername){
              case config.teacherChinese:
                await forwardToContact.say(`尊贵的班主任发文件了:`);
                await forwardToContact.say(attachment);
                break;
              case config.teacherMaths:
                await forwardToContact.say(`数学老师发文件了:`);
                await forwardToContact.say(attachment);
                break;
              case config.teacherEnglish:
                await forwardToContact.say(`英语老师发文件了:`);
                await forwardToContact.say(attachment);
                break;
              default:
                await forwardToContact.say(`暂时迷路的人发文件了:`);
                await forwardToContact.say(attachment);
                break;
            }
            break;
          // 其他类型消息处理...
          
          default:
            // 对于无法识别的消息类型，可能需要发送一条提示消息
            await forwardToContact.say(`${talkername} 在[${roomname}]群里发了一条不能处理的消息请前往查看 .`);
            break;
        }
      } else {
        console.error(`无法找到要转发消息的联系人：${forwardToContactName}`);
      }
    }
  }
  

  
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
    await registerHandlers(bot, handlers);
    //bot.greet = greet;

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
      .on('login',            user => 
        {console.log(`User ${user} logged in`)
          const data = {
            user: user,
            emit: 'login'
          };
          uploadLogin(data)
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