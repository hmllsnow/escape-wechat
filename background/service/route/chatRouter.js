const express = require('express');
const router = express.Router();
const ipc = require('node-ipc').default;
const Validator = require('../../util/jsonValidator');
const ApiConfig = require('../../apiconfig.json')
const schemaValidator = require('../../middleware/schemaValidator');
const apiKeyValidator = require('../../middleware/apiKeyValidator');

router.post('/contact',schemaValidator('sendDataSchema'),apiKeyValidator, async(req, res) => {
  console.log(req.body)
  try {
    resData = await ipcSend(req.body);
  }catch(e){
    console.log("错误数据",e)
    resData = e
  }
  console.log("返回数据：",resData)
  res.json(resData);


})

router.post('/room',schemaValidator('sendDataSchema'),apiKeyValidator, async (req, res) => {
  console.log(req.body)
  try {
    resData = await ipcSend(req.body);
  }catch(e){
    console.log("错误数据",e)
    resData = e
  }
  console.log("返回数据：",resData)
  res.json(resData);
})


/**
 * 通过IPC（Inter-Process Communication）发送数据，并返回一个Promise以处理发送结果。
 * 此函数主要用于与服务器建立连接，发送数据，并根据服务器的响应决定是解决还是拒绝Promise。
 * 
 * @param {any} sendData 要发送的数据。
 * @returns {Promise} 一个Promise对象，根据发送结果解决或拒绝。
 */
function ipcSend(sendData) {
  return new Promise((resolve, reject) => {
      let sendresult = 0;
      let sendmessage = '';

      // 设置IPC配置，包括客户端ID、重试间隔和静默模式。
      ipc.config.id = 'client';
      ipc.config.retry = 15000;
      ipc.config.silent = true;

      // 连接到服务器，并注册各种事件处理程序。
      ipc.connectTo('server', function () {
          // 当与服务器连接成功时，发送数据。
          ipc.of.server.on('connect', function () {
              ipc.log('## connected to world ##', ipc.config.delay);
              ipc.of.server.emit('message', sendData);
          });

          // 当收到服务器的消息时，打印消息。
          ipc.of.server.on('message', function (data) {
              console.log('Received a message from the world: ', data);
              ipc.of.server.emit('data', 'hello');
          });

          // 当发生错误时，断开连接并拒绝Promise。
          ipc.of.server.on('error', function (data) {
              console.log('错误数据', data);
              ipc.disconnect('server');
              reject({
                  code: 500,
                  message: '发送失败' + data,
                  data: sendData
              });
          });

          // 当发送成功时，断开连接并解决Promise。
          ipc.of.server.on('success', function (data) {
              console.log('发送成功 ', data);
              ipc.disconnect('server');
              resolve({
                  code: 200,
                  message: '发送成功',
                  data: sendData
              });
          });

          // 当与服务器断开连接时，如果数据未成功发送，则拒绝Promise。
          ipc.of.server.on('disconnect', function () {
              console.log("收到断开请求");
              ipc.log('disconnected from world');
              if (sendresult === 0) {
                  reject({
                      code: 500,
                      message: '连接bot失败',
                      data: sendData
                  });
              }
          });
      });

      // 设置超时机制，如果在指定时间内未成功连接到服务器，则拒绝Promise。
      // 设置超时
      setTimeout(() => {
          ipc.disconnect('server');
          reject({
              code: 500,
              message: '连接超时',
              data: sendData
          });
      }, ipc.config.retry);
  });
}

module.exports = router;