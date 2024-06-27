const ApiConfig = require('../apiconfig.json');

/**
 * 验证API密钥的中间件函数。
 * 
 * 此函数用于校验请求中携带的API密钥是否与预设的密钥匹配。
 * 如果密钥不匹配，则返回401未授权的响应；如果匹配，则继续处理请求。
 * 
 * @param {object} req Express请求对象，从中获取请求体中的API密钥。
 * @param {object} res Express响应对象，用于发送响应。
 * @param {function} next Express中间件的next函数，用于继续处理请求。
 */
const apiKeyValidator = (req, res, next) => {
  // 检查请求体中的API密钥是否与配置文件中的密钥匹配
  if (req.body.apiKey !== ApiConfig.apikey) {
    // 如果不匹配，返回401未授权的响应，并附带错误信息和空的数据部分
    return res.status(401).json({
      code: 401,
      message: "apikey不正确",
      data: ''
    });
  }
  // 如果密钥匹配，调用next函数继续处理请求
  next();
};

module.exports = apiKeyValidator;