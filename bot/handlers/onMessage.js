// onMessage.js

import { parseActionNameString } from '../Utils.js';

/**
 * 检查消息是否满足指定的规则
 * @param {Message} message 
 * @param {Object} rule 
 * @returns 
 */
function matchesRule(message, rule) {
  if (rule.whitelist && rule.whitelist !== '*' && !rule.whitelist.includes(message.talker().name())) return false;
  if (rule.keywords && rule.keywords !== '*' && !rule.keywords.some(keyword => message.text().includes(keyword))) return false;
  if (rule.regex && rule.regex !== '*' && !rule.regex.test(message.text())) return false;
  return true;
}
/**
 * 检查群是否满足指定的白名单
 * @param {Message} message 
 * @param {Object} rule 
 * @returns 
 */
function matchesRuleRoomWhilelist(message, rule) {
  if (rule.whitelist && rule.whitelist !== '*' && !rule.whitelist.includes(message.room.topic)) return false;
  return true;
}



/**
 * 检查群是否满足指定的说话人
 * @param {Message} message 
 * @param {Object} rule 
 * @returns 
 */
function matchesRuleTalkers(message, rule) {
  if (rule.talkers && rule.talkers !== '*' && !rule.talkers.includes(message.talker().name())) return false;
  return true;
}


/**
 * 检查群是否满足指定的白名单和说话人
 * @param {Message} message 
 * @param {Object} rule 
 * @returns 
 */
async function matchesRuleWhilelistandTalkers(message, rule) {
  const topic = await  message.room().topic()
  const talker = await message.talker().name()
  console.log(`topic[${topic}] whiltelist[${rule.whitelist}] whilte talkers[${rule.talkers}]`)
  if (rule.whitelist && rule.whitelist !== '*' && !rule.whitelist.includes(topic)) return false;
  if (rule.talkers && rule.talkers !== '*' && !rule.talkers.includes(talker )) return false;
  return true;
}
/**
 * 检查消息是否满足指定的关键字且满足正则表达式
 * @param {Message} message 
 * @param {Object} rule 
 * @returns 
 */
function matchesKeyorRegex(message, rule) {
  if (rule.keywords && rule.keywords !== '*' && !rule.keywords.some(keyword => message.text().includes(keyword))) return false;
  if (rule.regex && rule.regex !== '*' && !rule.regex.test(message.text())) return false;
  return true;
}

/**
 * 处理收到的消息
 * @param {Message} message 
 * @param {Object} bot 
 * @param {Object} config 
 */
async function onMessage( bot, message,config) {
  if (message.self()) {
    console.log('自己发送的消息，暂不处理!')
    return;
   }
  const room = message.room();
  const type = message.type();


  if (room) {
    console.log('进入群消息');
    if(type===bot.Message.Type.Text){
      console.log('群消息是 文本 消息');
      await handleRoomMessage(message, bot, config.room);
    }else{
      console.log('群消息是 非文本 消息');
      await handleRoomNonTextMessage(message, bot, config.room);
    }
    
  } else {
    console.log('进入个人消息');
    if(type===bot.Message.Type.Text){
      console.log('个人消息是 文本 消息');
      await handlePersonalMessage(message, bot, config.personal);
    }else{
      console.log('个人消息是 非文本 消息');
      await handlePersonalNonTextMessage(message, bot, config.personal);
    }
  }
}

/**
 * 处理个人消息（文本）
 * @param {Message} message 
 * @param {Object} bot 
 * @param {Object} config 
 */
async function handlePersonalMessage(message, bot, config) {

  const { reply } = config;
  const { forward } = config;
  const { actions } = config;
  /*
  * 如果回复，转发，动作的条件都满足，那都会执行
  * 但是每种类型的规则只会运行第一个符合条件的
  * 
  */
  console.log('entry function handlePersonalMessage')
  console.log(`${message.talker().name()}说:${message.text()}}`)
  console.log(`${message.talker().alias()}`)
  // 遍历回复规则数组
  for (const rule of reply) {
    if (matchesRule(message, rule)) {
      console.log('config=', rule.handler);
      await replyMessage(message, bot, rule.handler);
      break; // 找到匹配的规则后停止遍历
    }
  }
  
  for (const rule of forward) {
    if (matchesRule(message, rule)) {
      console.log('config=', rule.handler);
      await forwardMessage(message, bot, rule);
      break; // 找到匹配的规则后停止遍历
    }
  }

  for (const rule of actions) {
    if (matchesRule(message, rule)) {
      console.log('config=', rule.handler);
      await actionHandler(message, bot, rule.handler);
      break; // 找到匹配的规则后停止遍历
    }
  }
  console.log('no match exit function handlePersonalMessage')

}

/**
 * 处理个人消息(非文本)
 * @param {Message} message 
 * @param {Object} bot 
 * @param {Object} config 
 */
async function handlePersonalNonTextMessage(message, bot, config) {
  const { nontext } = config;
  /*
  * 如果非文本只会有一种类型
  * 但是类型的规则只会运行第一个符合条件的
  * 
  */
  // 遍历回复规则数组
  for (const rule of nontext) {
    if (matchesRule(message, rule)) {
      console.log('条件满足-》配置config=', rule.handler);
      await nontextHandler(message, bot, rule.handler,rule);
      break; // 找到匹配的规则后停止遍历
    }
  }

}

/**
 * 处理群消息（文本）
 * @param {Message} message - 收到的群消息对象
 * @param {Object} bot - Wechaty 实例
 * @param {Object} config - 配置对象
 */
async function handleRoomMessage(message, bot, config) {

  const { reply } = config;
  const { forward } = config;
  const { actions } = config;
  const room = message.room();
  const roomName = await room.topic();
  const mentionedList = await message.mentionList();

  const content = message.text()
  console.log(`content[${content}]`)
  const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
  const isMentioned = await message.mentionSelf() || content.includes(`@${userSelfName}`) //是否被@
  const isMentionAll = content.includes('@所有人');


  console.log(`进入群文本消息处理，被@[${isMentioned}],@所有人[${isMentionAll}]`)
  // 遍历回复规则数组
  for (const rule of reply) {

    if(await matchesRuleWhilelistandTalkers(message,rule)){
      console.log(`群名和发消息人校验通过，进入消息回复规则处理`)
      if ( matchesKeyorRegex(message, rule) || (isMentioned && rule.mentionMe) || (isMentionAll && rule.mentionAll)) {
        console.log('config=', rule.handler);
        await replyMessage(message, bot, rule.handler);
        break; // 找到匹配的规则后停止遍历
      }
    }
  }

  // 遍历转发规则数组
  for (const rule of forward) {
    
    if(await matchesRuleWhilelistandTalkers(message,rule)){
      console.log(`群名和发消息人校验通过，进入消息转发规则处理`)
      if ( matchesKeyorRegex(message, rule) || (isMentioned && rule.mentionMe) || (isMentionAll && rule.mentionAll)) {
        console.log('config=', rule.handler);
        await await forwardMessage(message, bot, rule);
        break; // 找到匹配的规则后停止遍历
      }


    }
  }

  // 遍历动作规则数组
  for (const rule of actions) {
    
    if(await matchesRuleWhilelistandTalkers(message,rule)){
      console.log(`群名和发消息人校验通过，进入 动作 规则处理`)
      if (matchesRule(message, rule)){
        console.log('config=', rule.handler);
        await actionHandler(message, bot, rule.handler);
        break;
      }
    }
  }
}

/**
 * 处理群消息（非文本）
 * @param {Message} message - 收到的群消息对象
 * @param {Object} bot - Wechaty 实例
 * @param {Object} config - 配置对象
 */
async function handleRoomNonTextMessage(message, bot, config) {

  const { nontext } = config;

  const room = message.room();
  const roomName = await room.topic();
  const mentionedList = await message.mentionList();

  const content = message.text()
  console.log(`content[${content}]`)
  const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
  const isMentioned = await message.mentionSelf() || content.includes(`@${userSelfName}`) //是否被@
  const isMentionAll = content.includes('@所有人');


  console.log(`进入群文本消息处理，被@[${isMentioned}],@所有人[${isMentionAll}]`)
  // 遍历回复规则数组
  for (const rule of nontext) {

    if(await matchesRuleWhilelistandTalkers(message,rule)){
      console.log(`群名和发消息人校验通过，进来了！！！！！！！！！`)
        console.log('config=', rule.handler);
        await nontextHandler(message, bot, rule.handler,rule);
        break; // 找到匹配的规则后停止遍历
    }
  }

}

/**
 * 回复消息
 * @param {Message} message 
 * @param {String} handlerName 
 */
async function replyMessage(message, bot, handlerString) {
  const [handlerName, params] = parseActionNameString(handlerString)
  const handler = bot[handlerName];
  if (typeof handler === 'function') {
    await handler(message,bot,handlerName,params);
  } else {
    console.error(`Handler function ${handlerName} not found or not implemented.`);
  }
}

/**
 * 默认转发方法，转发消息
 * 2024.03.26测试通过
 * @param {Message} message - 收到的消息对象
 * @param {Object} bot - Wechaty 实例
 * @param {Object} config - 转发配置对象
 */
async function forwardMessage(message, bot, config) {
  // 检查是否有特定的转发处理函数

  console.log('配置的转发方法',config.handler)
  if (config.handler && typeof bot[config.handler] === 'function') {
    console.log('配置了处理方法')
    await bot[config.handler](message,bot);
  } else {
    console.log('默认转发方法')
    // 如果没有配置特定的转发处理函数，或者处理函数不存在，则按照默认方式转发

    // 转发到指定的联系人，如果配置了 targetContacts
    if (Array.isArray(config.targetContacts) && config.targetContacts.length > 0) {
      for (const contactName of config.targetContacts) {
        const targetContact = await bot.Contact.find({ name: contactName });
        if (targetContact) {
          if(message.room()){
            const room = message.room();
            const name  = await room.alias(message.talker())||message.talker().name()
            await targetContact.say(`转发[${await message.room().topic()}][${name}]的消息：\n${message.text()}`);
          }else{
            await targetContact.say(`转发[${await message.talker().name()}]的消息：\n${message.text()}`);
          }
          
        }
      }
    }

    // 转发到指定的群聊，如果配置了 targetRooms
    if (Array.isArray(config.targetRooms) && config.targetRooms.length > 0) {
      for (const roomName of config.targetRooms) {
        const targetRoom = await bot.Room.find({ topic: roomName });
        if (targetRoom) {
          
          if(message.room()){
            await targetContact.say(`转发[${await message.room().topic()}][${message.talker().name()}]的消息：\n${message.text()}`);
          }else{
            await targetContact.say(`转发[${await message.talker().name()}]的消息：\n${message.text()}`);
          }

        }
      }
    }
  }
}

/**
 * 执行动作处理
 * 2024.03.26测试通过
 * @param {Message} message 
 * @param {Object} bot 
 * @param {String} actionName 
 */
async function actionHandler(message, bot, actionString) {
  
  const [actionName, params] = parseActionNameString(actionString)
  const action = bot[actionName];
  if (typeof action === 'function') {
    await action(bot,message,params);
  } else {
    console.error(`Action function ${actionName} not found or not implemented.`);
  }
}

/**
 * 非文本信息处理函数
 * 2024.03.26测试通过
 * @param {Message} message 
 * @param {Object} bot 
 * @param {String} handlerName 
 */
async function nontextHandler(message, bot, handlerName,rule) {
  const action = bot[handlerName];
  if (typeof action === 'function') {
    await action(bot,message,rule);
  } else {
    console.error(`Action function ${handlerName} not found or not implemented.`);
  }
}

export { onMessage };