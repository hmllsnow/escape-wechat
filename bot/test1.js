
/**
 * 解析操作名称字符串。
 * 
 * 该函数接收一个字符串输入，该字符串由操作处理器名称和可选的参数字符串组成，用'##'分隔。
 * 它的目的是将输入字符串分割成操作处理器名称和参数对象，如果参数字符串不是有效的JSON，则返回空对象。
 * 
 * @param {string} input - 输入字符串，包含操作处理器名称和可选的参数字符串。
 * @returns {Array} 返回一个数组，第一个元素是操作处理器名称，第二个元素是解析后的参数对象，如果解析失败，则为空对象。
 */
function parseActionNameString(input) {
  // 使用'##'分割输入字符串，得到操作处理器名称和参数字符串
  // 使用 '##' 分割输入字符串
  const [actionHandlerOri, ...rest] = input.split('##');//兼容字符串中出现多个##的情况
  const paramsString = rest.join('##');
  const actionHandler=actionHandlerOri.replace(/\n/g, '')
  // 如果没有参数字符串，直接返回操作处理器名称和空对象
  // 如果没有参数部分，返回动作处理器名称和空对象
  if (!paramsString) {
    return [actionHandler, {}];
  }

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

// 使用示例
const input = "replyOpenAI\n##\n{\nbaseurl:\"https://api.deepseek.com\",\napikey:\"sk-******************\",\nmodel:\"deepseek-chat\"\n}";
const [action, params] = parseActionNameString(input);

console.log("Action:", action);
console.log("Parameters:", params);

// 示例：如何将参数传递给另一个函数
function anotherFunction(params) {
  console.log("Received parameters:", params.apikey);
}

anotherFunction(params);