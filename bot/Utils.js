async function removeMentions(message) {
    // 获取当前聊天室的所有成员
    console.log('进入removeMentions')
    const mentionedList = await message.mentionList();
    const room = message.room() 
    let text = message.text();
    // 构建一个正则表达式，匹配任何以 @ 开头的提及
    
    
    // 遍历所有成员，为每个成员创建一个正则表达式并替换文本
    for (const mentioned of mentionedList) {
      const menthionName = await room.alias(mentioned) || mentioned.name();
      const menberRegex = `@${menthionName}`
      text = text.replace(menberRegex, '').trim();
    }
    console.log('removeMentions 处理后的text=',text)
    return text;
  }

  function isQuoted(message) {
    
  }

  function getQuotedText(message) {
    /*
      被引用的示范
    「老黄：我希望自己可以更强大，这个文章让你逐步恢复掌控感，活出精彩的人生。」
    - - - - - - - - - - - - - - -
    这是啥？
    */

    return;
  }
  // 配置文件解析
 

  export function configParser(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }
  
    if (Array.isArray(obj)) {
      obj.forEach(configParser);
      return;
    }
  
    for (const key in obj) {
      if (key === 'regex') {
        obj[key] = new RegExp(obj[key]);
      } else {
        configParser(obj[key]);
      }
    }
  }

  export  async function getConfig() {
    try {
      const response = await axios.get(url+'/config', {
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
        throw new Error('获取配置失败'+response);
      }
    } catch (error) {
      console.error('获取配置出错:', error);
      throw new Error('获取配置出错'+error);
    }
  }

  export default removeMentions