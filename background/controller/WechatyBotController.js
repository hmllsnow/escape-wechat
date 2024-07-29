const { spawn } = require('child_process');
const path = require('path');
const childProcess = require('child_process');
const botstatusHandler = require('../handler/botstatusHandler');
/**
 * 用于管理微信机器人进程
 * startBot() 启动微信机器人进程，他的启动命令是node demo.js
 * 當發現輸出中包含Bot started或者logged in 時，则表示机器人启动成功。
 * 这个class是一个单例类，确保只有一个机器人进程在运行。
 * 
 */


class WechatyBotController {
  constructor(botPath) {
    if (WechatyBotController.instance) {
      return WechatyBotController.instance;
    }

    this.botProcess = null;
    this.botPath = botPath;
    this.logger = console; // 可以替换为更高级的日志记录器
    this.logger.log("构造函数botpath:",botPath)
    WechatyBotController.instance = this;
  }

  /**
   * 启动微信机器人进程
   * @returns {Promise} 一个包含进程ID的对象
   */
  startBot() {
    return new Promise((resolve, reject) => {
      this.logger.log("进程拿到的path:",this.botPath)
      const startCommand = `node "${path.join(this.botPath, './demo.js')}"`; 
      this.logger.log(`this class botProcess:${this.botProcess}`);
      this.logger.log("start command:",startCommand)
      if (this.botProcess) {
        this.logger.log(`Bot already running with PID ${this.botProcess.pid}`);
        return resolve({ pid: this.botProcess.pid,remark:'请勿重复启动bot，如存在问题请重启bot' });
      }
      
      //this.botProcess = spawn(startCommand, { shell: true });    //使用shell true运行会返回cmd这个进程
      this.botProcess = childProcess.spawn('node', [path.join(this.botPath, 'demo.js')]); 
      let stdoutData = ''; 
      let pid = this.botProcess.pid 
      let timeoutID=setTimeout(() => {
        //20s 后再监听错误信息
        this.botProcess.stderr.on('data', (data) => {      
          this.logger.error('Error output from bot:', data.toString());      
          reject(new Error('Error starting bot'));    
        });    
        this.botProcess.on('error', (error) => {      
          this.logger.error('Error starting bot:', error);      
          reject(error);    
        });
      }, 10000);
      this.botProcess.stdout.on('data', (data) => {      
        stdoutData = data.toString();      
        // 检查输出中是否包含启动成功的标识信息      
        if (stdoutData.includes('Bot started')||stdoutData.includes('logged in')) {
          this.logger.info('Bot started successfully');        
          resolve({ pid: pid});
          clearTimeout(timeoutID);
          this.botProcess.stderr.removeAllListeners('data');  
          this.botProcess.stdout.removeAllListeners('data');       
          this.botProcess.removeAllListeners('error'); 
          
          return; 
        }
      });
       
        
    });
  }
        //在这个示例中，我们监听 `stdout` 流并累积输出数据。每当有新的数据到来时，我们检查它是否包含字符串 "Bot started"（或者其他你期望的启动成功标识）。如果找到了，我们就解决 Promise 并返回进程 ID。如果在任何时候 `stderr` 有输出，我们认为启动失败，并拒绝 Promise。请注意，这种方法假设 `demo.js` 会在控制台输出启动成功的消息。如果 `demo.js` 不是这样设计的，你需要相应地调整检查条件。此外，如果 `demo.js` 的启动消息不是立即输出的，你可能需要等待一段时间或者使用其他机制来确定启动状态。

  /**
   * 停止微信机器人进程
   * @param {number} pid - 进程ID
   * @returns {Promise} 一个表示操作成功的对象
   */
  stopBot(pid) {
    return new Promise((resolve, reject) => {
      if (this.botProcess && this.botProcess.pid === pid) {
        const timeout = setTimeout(() => {
          this.logger.warn('Bot did not stop gracefully, forcing termination.');
          console.log('bot的pid=',this.botProcess.pid)
          //this.botProcess.kill('SIGKILL');
          this.logger.log('Bot terminated.');
          process.kill(pid, 'SIGKILL'); 
          this.botProcess = null;
        }, 10000); // 10秒后如果进程还没退出，则强制终止
  
        
        this.botProcess.on('close', (code, signal) => {
          clearTimeout(timeout);
          if (signal === 'SIGTERM'  || code === 0) {
            this.logger.log('Bot stopped successfully.');
            console.log('bot的botProcess=',this.botProcess)
            let botstatus = new botstatusHandler()
            botstatus.setQrcode(null)
            botstatus.setStatus('bot进程未启动')
            this.botProcess = null;
            
            resolve({ success: true });
          } else {
            this.logger.error('Bot stopped with errors:', code, signal);
            resolve({ success: false, message: `Bot stopped with exit code ${code} and signal ${signal}` });
          }
        });
        
  
        this.logger.log('Bot stopping.');
        //this.botProcess.kill('SIGINT');
        this.botProcess.kill('SIGTERM');
        //this.botProcess.kill('SIGKILL');
        //process.kill(pid, 'SIGINT'); 

      } else {
        this.logger.log('Bot not found with given PID.');
        resolve({ success: false, message: 'Process not found' });
      }
    });
  }

  /**
   * 重启微信机器人
   * @param {number} pid - 进程ID
   * @returns {Promise} 一个包含新启动进程ID的对象
   */
  restartBot(pid) {
    return this.stopBot(pid).then(() => {
      return this.startBot();
    }).then((newBotProcess) => {
      this.logger.log(`Bot restarted with new PID: ${newBotProcess.pid}`);      return newBotProcess;    }).catch((error) => {      this.logger.error('Error restarting bot:', error);      throw error; // 抛出错误以便调用者可以处理    
    });  
  }}
  module.exports = WechatyBotController;
