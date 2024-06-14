// bot-handlers.js
import { configParser } from '../Utils.js'
import { config } from '../config.js'
import ChatWithCoze from '../ChatWithCoze.js'
import removeMentions from '../Utils.js'
import OpenAI from "openai";
//从文件openai.json读取配置参数
import openaiconfig from '../openai.json' assert { type: 'json' };



/**
 * 向用户问候
 * @param {Message} message - 收到的消息对象
 */
export async function greet(message) {
  // ... 函数实现 ...
  console.log('这里是greet方法')
  await message.say("dong");
}



/**
 * 在群里回复“收到”
 * @param {Message} message - 收到的消息对象
 */
export async function replyMeeting(message) {
  // 确保message是从群里来的
  if (message.room()) {
    // 获取群聊实例
    const room = await message.room();
    // 在群里回复“收到”
    await room.say('收到');
  }
}


/**
 * 在群里被@ 后，去问coze
 * @param {Message} message - 收到的消息对象
 */
export async function replyCoze(message,bot) {
  // 确保message是从群里来的
  if (message.room()) {
    // 获取群聊实例
    const room = await message.room();
    let content = await message.text()



    const talker = await message.talker();


    const receiver = message.to()

    const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
    const receiverName = receiver?.name()
    console.log('replyCoze----原始content=',content);
    //content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
    //console.log(`hml----content=${content}`);
    console.log('replyCoze----处理后的content=',content);
    
    content = await removeMentions(message);
    try{
      const coze =  new ChatWithCoze('https://coze-discord-proxy-isb0.onrender.com/v1/chat/completions', '', 'HMLLSNOW1217');
      const reply = await coze.sendAndReceiveMessage(content.toString());
      await room.say(`${reply}\n          from coze`,talker);
    }catch(e){
      console.log('coze error',e);
      await room.say(`智能机器人COZE出错了，请稍后再试吧\n${e.toString()}`,talker);
    }
    
    
  }
}

/**
 * 在群里被@ 后，去问openAI的api接口（任何openAI格式的api都支持）
 * @param {Message} message - 收到的消息对象
 */
export async function replyOpenAI(message,bot) {
  // 确保message是从群里来的
  if (message.room()) {
    // 获取群聊实例
    const room = await message.room();
    let content = await message.text()
    const talker = await message.talker();
    const receiver = message.to()
    const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
    const receiverName = receiver?.name()
    


    console.log('replayOpenAI----原始content='+content);
    //content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
    //console.log(`hml----content=${content}`);
    content = await removeMentions(message);
    console.log('replayOpenAI----处理后的content='+content);
    try{
      console.log('openai config='+openaiconfig);

      
      const openai = new OpenAI({
        apiKey: `${openaiconfig.apikey}`,
        baseURL: `${openaiconfig.baseurl}` ,
      });
      const completion = await openai.chat.completions.create({
        messages: [{role: "user", content: `${content}` }],
        //{ role: "system", content: "You are a helpful assistant." },{role: "user", content: "请做个自我介绍." }
        model: `${openaiconfig.model}`,
      });
    
      console.log(completion.choices[0]);
      const reply = completion.choices[0].message.content;

      await room.say(`${reply}\n  from internlm2`,talker);
    }catch(e){
      console.log('openai error',e);
      await room.say(`调用api出错了，请稍后再试吧\n${e.toString()}`,talker);
    }
    
    
  }else{//如果是非群聊
    console.log('这里是非群聊的replyOpenAI方法')
    let content = await message.text()
    const talker = await message.talker();
    const receiver = message.to()
    const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
    const receiverName = receiver?.name()
    console.log('replayOpenAI----原始content='+content);
    //content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
    //console.log(`hml----content=${content}`);
    content = await removeMentions(message);
    console.log('replayOpenAI----处理后的content='+content);
    try{
      console.log('openai config='+openaiconfig);
      const openai = new OpenAI({
        apiKey: `${openaiconfig.apikey}`,
        baseURL: `${openaiconfig.baseurl}` ,
      });
      const completion = await openai.chat.completions.create({
        messages: [{role: "user", content: `${content}` }],
        //{ role: "system", content: "You are a helpful assistant." },{role: "user", content: "请做个自我介绍." }
        model: `${openaiconfig.model}`,
      });
    
      console.log(completion.choices[0]);
      const reply = completion.choices[0].message.content;

      await message.say(`${reply}\n  from LLM`,talker);
    }catch(e){
      console.log('openai error'+e.toString());
      await message.say(`调用api出错了，请稍后再试吧\n${e.toString()}`,talker);
    }

  }
}


/**
 * 回复特定的关键词s
 * @param {Message} message - 收到的消息对象
 * @param {string} keyword - 要回复的关键词
 */
export async function replyKeyword(message, keyword) {
  // ... 函数实现 ...
}

/**
 * 转发文本消息
 * @param {Message} message - 收到的消息对象
 * @param {Object} bot - Wechaty 实例
 */
export async function zhuanfa(message,bot) {
    console.log('这里是转发方法zhuanfa')

  }

/**
 * 动作消息
 * @param {Message} message - 收到的消息对象
 * @param {Object} bot - Wechaty 实例
 */
export async function actionHandler(bot,message) {
    console.log('这里是action方法actionHandler')
    await message.say("操死你！！！！");
  }

/**
 * 提供帮助信息
 * @param {Message} message - 收到的消息对象
 */
export async function provideHelp(message) {
  // ... 函数实现 ...
}

/**
 *  非文本类消息转发处理函数
 */
export async function nontextForwardHandler(bot, message, handlername) {
  configParser(config);
  console.log('这里是nontextForwardHandler方法nontextForwardHandler');
  let configname = handlername+"_config";
  const handlersconfig = config.handlersconfig;
  const { targetContacts, targetRooms } = handlersconfig[configname];
  console.log(`配置读出，targetContacts=${targetContacts},targetRooms${targetRooms}`);
  
  if (Array.isArray(targetContacts) && targetContacts.length > 0) {
    for (const contactName of targetContacts) {
      const targetContact = await bot.Contact.find({ name: contactName });
      if (targetContact) {
        innerForwardMessage(message,bot,targetContact);
      }
    }
  }

  // 转发到指定的群聊，如果配置了 targetRooms
  if (Array.isArray(targetRooms) && targetRooms.length > 0) {
    for (const roomName of targetRooms) {
      const targetRoom = await bot.Room.find({ topic: roomName });
      if (targetRoom) {
        innerForwardMessage(message,bot,targetRoom);
      }
    }
  }


}
/**
 * 内部使用的消息转发处理函数
 * @param {*} message 
 * @param {*} bot 
 * @param {*} contact 
 * @returns 
 */
async function innerForwardMessage(message, bot, contact) {
  console.log('innerForwardMessage', message, bot, contact);
  if (!message || !bot || !contact) {
    console.error('Invalid arguments for forwardMessage function.');
    return;
  }
  let prompt = '';
  if(message.room()){
    prompt = `[${await message.room().topic()}][${message.talker().name()}]`;
  }else{
    prompt =`[${await message.talker().name()}]`;
  }

  try {
    // 根据消息类型进行不同的处理
    switch (message.type()) {
      case bot.Message.Type.Audio:
        // 处理音频消息
        // 注意：Wechaty 不支持直接转发音频文件，以下代码仅为示例
        
        await contact.say(`${prompt}发了音频消息，我暂处理不了，去亲自听听吧！`);
        break;
      case bot.Message.Type.Video:
        // 处理视频消息
        // 注意：Wechaty 不支持直接转发视频文件，以下代码仅为示例
        //const videoUrl = message.url(); // 获取视频文件的网络地址
        const video = await message.toFileBox();
        await contact.say(`转发${prompt}发的视频：`);
        await contact.say(video);
        break;
      case bot.Message.Type.Emoticon:
        // 处理表情消息
        await contact.say(`转发${prompt}发的表情消息:\n ${message.description}`);
        break;
      case bot.Message.Type.Image:
        // 处理图片消息
        // 注意：Wechaty 不支持直接转发图片文件，以下代码仅为示例
        const image = await message.toFileBox();
        await contact.say(`转发${prompt}发的图片:`);
        await contact.say(image);
        break;
      case bot.Message.Type.Attachment:
        // 处理附件消息
        // 注意：Wechaty 不支持直接转发附件文件，以下代码仅为示例
        const attachment = await message.toFileBox();
        await contact.say(`转发${prompt}发的文件:`);
        await contact.say(attachment);
        break;
      case bot.Message.Type.MiniProgram:
        // 处理小程序消息
        const miniProgram = await message.toMiniProgram()
        let eol = '\n'
        if (miniProgram.payload) {
          const miniParse = `【小程序解析】${eol}${eol}appid：${miniProgram.appid()}${eol}username：${miniProgram.username().replace('@app', '')}${eol}标题：${miniProgram.title()}${eol}描述：${miniProgram.description()}${eol}路径：${decodeURIComponent(miniProgram.pagePath())}`
          contact.say(miniParse)
          
        }
        
        await contact.say(`${prompt}发了一个小程序，我暂处理不了，去亲自瞅瞅吧！`);
        //await contact.say(miniProgram);
        break;
      // ... 其他消息类型处理
      case bot.Message.Type.Transfer:
        // 处理转账消息
        
        
        await contact.say(`${prompt}发了一个转账，我暂处理不了，去亲自收钱吧！`);
        //await contact.say(miniProgram);
        break;
      // ... 其他消息类型处理

      default:
        // 无法识别的消息类型
        await contact.say(`收到${prompt}发送的无法识别的消息`);
    }
  } catch (error) {
    console.error('Error forwarding message:', error);
  }
}
/**
 * 在群里获取全体群成员的昵称（本群内姓名）但是无论是否同步，这个群名昵称总是不对
 * @param {*} bot 
 * @param {*} message 
 */
export async function actionRoomMembers(bot,message) {
  console.log('进入actionRoomMembers')
  const room = message.room();
  let status = room.sync();
  if (status) {
    console.log('同步群成员成功');
  } else {
    console.log('同步群成员失败');
  }
  const members = await room.memberList();
  let memberList = [];
  for (let member of members) {
    const alias =await room.alias(member) || member.name(); // 获取群内alias，如果没有alias，则用微信名（存在不更新的问题，谋个人手动修改一次自己的昵称就生效了）
    memberList.push(alias);
  }
  const namesString = memberList.join(', ');
  console.log(`群成员列表: ${namesString}`);
  await room.say(`群成员列表: \n${namesString}`);
}

/**
 * 在群里at所有人，目前存在问题，暂不可用
 * @param {*} bot 
 * @param {*} message 
 */
export async function actionAtRoomMembers(bot,message) {
  console.log('进入actionRoomMembers')
  const room = message.room();
  const members = await room.memberList();
  let memberList = [];
  for (let member of members) {
    const alias =await room.alias(member) || member.name(); // 获取群内alias，如果没有alias，则用微信名（存在不更新的问题，谋个人手动修改一次自己的昵称就生效了）
    memberList.push(`@${alias} `);
  }

  const namesString = memberList.join(', ');

  console.log(`群成员列表: ${namesString}`);
  const mentionList = members.map(c => c.id); 
  //const mentionMessage = new bot.Message(`群成员列表: ${namesString}`, ...members);
      // 发送消息
  
  await room.say('全体主意',...members);
  //await room.say(`群成员列表: \n${namesString}`);
}

/**
 * 函数名actionQuitRoom，接收消息，将消息发送者删除出群
 */

export async function actionQuitRoom(bot,message) {
  console.log('-----退群-----actionQuitRoom')
  const room = message.room();
  const members = await room.memberList();
  const talker = message.talker();
  try{
    await room.say(`你说想离开，那就自己拜拜吧，我还没这个能力`,talker)
    await room.remove(talker);
  }catch (e) {
    console.error("Bot", "getOutRoom() exception: " + e.toString());
  }
  




}






/**
 * 注册处理函数到 bot 实例
 * @param {Object} bot - Wechaty 实例
 * @param {Object} handlers - 处理函数的映射对象
 */
export function registerHandlers(bot, handlers) {
    Object.entries(handlers).forEach(([handlerName, handlerFunction]) => {
      bot[handlerName] = handlerFunction;
    });
}
// ... 其他自定义处理函数 ...



// 重导出所有命名导出的函数
//export default { greet, replyKeyword, provideHelp,registerHandlers };



