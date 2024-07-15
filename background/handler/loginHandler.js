const bcrypt = require('bcrypt');

const plainPassword = process.env.LOGIN_PWD;
let hashedPassword;

if (plainPassword) {
  // 如果提供了新密码，就进行哈希
  console.log('loginHandler--->环境变量LOGINPWD:',plainPassword);
  hashedPassword = bcrypt.hashSync(plainPassword, 10);
} else {
  // 如果没有提供新密码，使用之前存储的哈希密码（如果有的话）
  hashedPassword = bcrypt.hashSync('123456', 10);
}

module.exports = {
  hashedPassword: hashedPassword,
  jwtSecret: process.env.JWT_SECRET || hashedPassword,
};