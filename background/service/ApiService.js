const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const botrouter = require('./route/botRouter');
const configrouter = require('./route/configRouter');
const chatrouter = require('./route/chatRouter');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const errorHandler = require('../middleware/errorHandler');
/**
 * 总的api框架
 * 需要处理什么功能请添加路由
 * for exxample
 * const botrouter = require('./route/botRouter');
 * this.app.use('/api/bot',botrouter)
 * 
 */
class ApiService {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.botProcess = null;
    // this.app.use(cors({
    //   origin: 'http://localhost:7788',
    //   credentials: true
    // }));//支持跨域访问
    //this.app.use(cors());//支持跨域访问
    this.app.use(cors({
      origin: 'http://localhost:8080',
      credentials: true
    }));//支持跨域访问
    this.app.use(bodyParser.json());
    this.app.use('/api/bot',botrouter)
    this.app.use('/api',configrouter)
    this.app.use('/api/chat',chatrouter)
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`http服务已启动, 监听端口 ${this.port}`);
    });

    //在443端口启动https服务，使用app一样的路由
    https.createServer({
      key: fs.readFileSync(path.join(__dirname, '../cert/privatekey.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../cert/certificate.pem')),
      minVersion: 'TLSv1.2',
      secureOptions: require('constants').SSL_OP_NO_SSLv3 | require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1 // 禁用 SSLv3、TLSv1 和 TLSv1.1
    }, this.app).listen(443, () => {
      console.log('https服务已启动，监听端口443');
    });
  }



}

module.exports = ApiService;