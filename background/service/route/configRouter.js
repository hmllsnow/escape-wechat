const express = require('express');
const router = express.Router();
const {getConfig,setConfig} = require('../../handler/configHandler.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../handler/loginHandler.js')
const authMiddleware = require('../../middleware/auth');
/**
 * @api {get} /api/config 操作config
 * @apiName start
 * @apiGroup bot
 *
 * @apiSuccess {String} message 启动bot成功!
 */
router.get('/config',  (req, res) => {
  
  res.json({
    code: 200,
    message: '获得config成功!',
    data: getConfig()
  });
})

router.post('/config',authMiddleware,  (req, res) => {
  console.log(req.body.data)
  //调用setConfig，用回调的方式

  setConfig(req.body.data, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        message: '存储config失败!',
        data: err
      });
    } else {
      res.json({
        code: 200,
        message: '存储config成功!',
        data: data
      });
    }
  })
})

router.post('/login', (req, res) => {
  const { password } = req.body;
  console.log(`password is ${password}`)
  console.log(`config is ${config.hashedPassword} jwtSecret is ${config.jwtSecret}`)
  bcrypt.compare(password, config.hashedPassword, (err, result) => {
    if (err || !result) {
      return res.json({
        code: 401,
        message: '密码错误',
      });
    }

    const token = jwt.sign({ authenticated: true }, config.jwtSecret, { expiresIn: '48h' });

    res.json({
      code: 200,
      message: '登录成功',
      token: token
    });
  });
});
router.post('/verify-token', (req, res) => {
  const { token } = req.body;
  console.log(`token is ${token}`)
  if (!token) {
    return res.status(400).json({ code: 400, message: '未提供 token' });
  }

  try {
    jwt.verify(token, config.jwtSecret);
    res.json({ code: 200, message: 'Token 有效' });
    console.log('token is valid')
  } catch (error) {
    console.log('token is not invalid')
    console.error(error);
    res.status(401).json({ code: 401, message: 'Token 无效或已过期' });
  }
});



module.exports = router;