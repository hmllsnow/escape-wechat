const express = require('express');
const router = express.Router();
const WechatyBotController = require('../../controller/WechatyBotController');
const path = require('path');
const botPath = path.join(__dirname, '../../../bot');
const wechatyBot = new   WechatyBotController(botPath);
const qrcodeTerminal =require('qrcode-terminal') 
const botstatusHandler = require('../../handler/botstatusHandler');

const botstatus = new botstatusHandler();
const authMiddleware = require('../../middleware/auth');

/**
 * @api {get} /api/bot/start 启动bot
 * @apiName start
 * @apiGroup bot
 *
 * @apiSuccess {String} message 启动bot成功!
 */
router.get('/start', authMiddleware,(req, res) => {
  wechatyBot.startBot()
  .then((data) => {
    console.log('Bot started with PID:', data.pid);
    res.json({
      code: 200,
      message: '启动bot成功!',
      data: data
    });

  })
  .catch((error) => {
      console.error('An error occurred:', error);
      res.json({
        code: 500,
        message: '启动bot失败!',
        data: error
      });
  });


  
})

router.get('/stop' , authMiddleware, (req, res) => {
  if(!wechatyBot.botProcess){
    res.json({
      code: 500,
      message: 'bot未启动!',
      data: null
    });
    return;
  }
  wechatyBot.stopBot(wechatyBot.botProcess.pid)
  .then((data) => {
    res.json({
      code: 200,
      message: '停止bot成功!',
      data: data
    });

  })
  .catch((error) => {
      console.error('An error occurred:', error);
      res.json({
        code: 500,
        message: '停止bot失败!',
        data: error
      });
  });

})

router.get('/restart',authMiddleware, (req, res) => {
  if(!wechatyBot.botProcess){
    res.json({
      code: 500,
      message: 'bot未启动!',
      data: null
    });
    return;
  }
  wechatyBot.restartBot(wechatyBot.botProcess.pid)
  .then((data) => {
    res.json({
      code: 200,
      message: '重启bot成功!',
      data: data
    });

  })
  .catch((error) => {
      console.error('An error occurred:', error);
      res.json({
        code: 500,
        message: '重启bot失败!',
        data: error
      });
  });
  

})

router.get('/status',authMiddleware,  (req, res) => {
  console.log('请求查询bot status=',botstatus.getStatus());
  res.json({
    code: 200,
    message: 'bot状态查询成功!',
    data: {status:botstatus.getStatus()}
  });
})

router.get('/qrcode',authMiddleware,  (req, res) => {
  console.log('请求查询bot qrcode=',botstatus.getQrcode());
  res.json({
    code: 200,
    message: 'bot qrcode查询成功!',
    data: {qrcode:botstatus.getQrcode()}
  });
})


router.post('/qrcodeupload',  (req, res) => {
  console.log('qecodeupload=',req.body);
  qrcodeTerminal.generate(req.body.qrcode, { small: true });
  botstatus.setQrcode(req.body.qrcode);
  botstatus.reciveQrcode();
  res.json({
    code: 200,
    message: '二维码上传成功!',
    data: req.body
  });
})

router.post('/login',  (req, res) => {
  console.log('login=',req.body);
  botstatus.reciveLogin() 
  res.json({
    code: 200,
    message: 'login状态上传成功!',
    data: req.body
  });
})
//接受/logout状态
router.post('/logout',  (req, res) => {
  console.log('logout=',req.body);
  botstatus.reciveLogout()
  res.json({
    code: 200,
    message: 'logout状态上传成功!',
    data: req.body
  });
})


module.exports = router;