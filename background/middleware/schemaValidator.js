const Validator = require('../util/jsonValidator');
const path = require('path');

/**
 * 根据给定的模式名称生成一个中间件函数，用于验证请求体的数据是否符合指定模式。
 * 这个中间件特别适用于API验证，确保客户端发送的数据符合预期的结构和类型。
 * 
 * @param {string} schemaName - 模式文件的名称。这个名称将用于拼接路径并加载对应的JSON模式文件。
 * @returns {function} 返回一个中间件函数，该函数接受请求、响应和下一个中间件作为参数。
 */
const schemaValidator = (schemaName) => {
  /**
   * 中间件函数，用于验证请求体的数据。
   * 它首先尝试加载对应的模式文件，然后使用该模式验证请求体的数据。
   * 如果数据验证失败，它将返回一个包含错误信息的400响应。
   * 如果验证成功，它将调用下一个中间件继续处理请求。
   * 
   * @param {object} req - 请求对象，其中包含客户端发送的请求数据。
   * @param {object} res - 响应对象，用于向客户端发送响应。
   * @param {function} next - 中间件函数，用于继续处理请求链。
   */
  return (req, res, next) => {
    // 拼接路径以加载对应的模式文件。
    const schemaPath = path.join(__dirname,  '..', 'schema', `${schemaName}.json`);
    // 使用加载的模式创建一个新的验证器实例。
    const validator = new Validator(require(schemaPath));
    // 使用验证器验证请求体的数据。
    const result = validator.validateData(req.body);
    
    // 如果验证失败，返回一个包含错误信息的400响应。
    if (!result.valid) {
      return res.status(400).json({
        code: 400,
        message: "数据校验出错",
        data: result.errors
      });
    }
    // 如果验证成功，调用下一个中间件继续处理请求。
    next();
  };
};

module.exports = schemaValidator;