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


  /**
 * 解析操作名称字符串。
 * 
 * 该函数接收一个字符串输入，该字符串由操作处理器名称和可选的参数字符串组成，用'##'分隔。
 * 它的目的是将输入字符串分割成操作处理器名称和参数对象，如果参数字符串不是有效的JSON，则返回空对象。
 * 
 * @param {string} input - 输入字符串，包含操作处理器名称和可选的参数字符串。
 * @returns {Array} 返回一个数组，第一个元素是操作处理器名称，第二个元素是解析后的参数对象，如果解析失败，则为空对象。
 */
export function parseActionNameString(input) {
  // 使用'##'分割输入字符串，得到操作处理器名称和参数字符串
  // 使用 '##' 分割输入字符串
  console.log("parseActionNameString:"+input)
  const [actionHandlerOri, ...rest] = input.split('##');//兼容字符串中出现多个##的情况
  const paramsString = rest.join('##');
  const actionHandler=actionHandlerOri.replace(/\n/g, '')
  // 如果没有参数字符串，直接返回操作处理器名称和空对象
  // 如果没有参数部分，返回动作处理器名称和空对象
  if (!paramsString) {
    console.log("parseActionNameString no paramsString:"+actionHandler)
    return [actionHandler, {}];
  }
  console.log("parseActionNameString paramsString:"+paramsString)
  try {
    // 尝试将参数字符串解析为JSON对象，替换冒号前的单词为JSON字符串的关键字
    // 这是为了处理JSON解析要求关键字必须用引号括起来的问题
    let paramsObject;
    try {
      paramsObject = JSON.parse(paramsString);
    } catch (e) {
      // 如果直接解析失败，尝试修复格式
      const fixedString = paramsString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');

      console.log("Fixed string:", fixedString);
      paramsObject = JSON.parse(fixedString);
    }
    return [actionHandler, paramsObject];
  } catch (error) {
    // 如果解析失败，打印错误信息，并返回操作处理器名称和空对象
    console.error("Error parsing parameters:", error);
    // 如果解析失败，返回动作处理器名称和空对象
    return [actionHandler, {}];
  }
}
  export default removeMentions