const Ajv = require('ajv');
class Validator {
  constructor(schema) {
    this.ajv = new Ajv({ allErrors: true }); // 初始化 AJV 并设置以显示所有错误。
    this.schema = schema; // 设置 JSON Schema。
    this.validate = this.ajv.compile(schema); // 编译 Schema 得到校验函数。
    
  }
  validateData(data) {
   
    const valid = this.validate(data);
    if (valid) {
      return { valid: true }; // 如果数据有效，返回 true。
    } else {
        const errorMessage = this.ajv.errorsText(this.validate.errors, { separator: ' ' });
        return {
            valid: false,
            errors: errorMessage // 如果数据无效，返回错误详情。
        };
    }
  }
}
module.exports = Validator;