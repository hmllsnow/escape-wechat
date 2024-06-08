const express = require('express');
const router = express.Router();
const {getConfig,setConfig} = require('../../handler/configHandler.js')
/**
 * @api {get} /api/config 操作config
 * @apiName start
 * @apiGroup bot
 *
 * @apiSuccess {String} message 启动bot成功!
 */
router.get('/config', (req, res) => {
  
  res.json({
    code: 200,
    message: '获得config成功!',
    data: getConfig()
  });
})

router.post('/config', (req, res) => {
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


module.exports = router;