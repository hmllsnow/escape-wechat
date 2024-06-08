// 模拟api接口
import axios from 'axios';
import QRCode  from 'qrcode';
//const url='http://localhost:3000/api';
const url='/api';

const api = {
    startRobot: async () => {
      // 调用启动机器人的api接口
      console.log('启动机器人');
      try {
        const response = await axios.get(url+'/bot/start', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          
        });
        if (response.data.code === 200) {
          return response.data.data.remark;
        }else if (response.data.code === 500) {
          return '进程已启动';
        } 
        else {
          console.error('启动机器人失败:', response);
          return '未知';
        }
      } catch (error) {
        console.error('获取机器人状态失败:', error);
        return '未知';
      }
      
    },
    stopRobot: async() => {
      // 调用停止机器人的api接口
      // ...
      console.log('停止机器人');
      try {
        const response = await axios.get(url+'/bot/stop', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          
        });
        if (response.data.code === 200) {
          return response.data.data;
        }else if (response.data.code === 500) {
          return '进程已停止';
        } 
        else {
          console.error('停止机器人报错:', response);
          return '未知';
        }
      } catch (error) {
        console.error('停止机器人报错:', error);
        return '未知';
      }
    },
    restartRobot: async () => {
      // 调用重启机器人的api接口
      console.log('重启机器人');
      try {
        const response = await axios.get(url+'/bot/restart', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          
        });
        if (response.data.code === 200) {
          return response.data.data;
        }else if (response.data.code === 500) {
          return '进程已停止,请使用启动';
        } 
        else {
          console.error('重启机器人报错:', response);
          return '未知';
        }
      } catch (error) {
        console.error('重启机器人报错:', error);
        return '未知';
      }
    },
    getConfig: async () => {
      // 调用获取config.json的api接口
      console.log('获取配置');
      try {
        const response = await axios.get(url+'/config', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          
        });
        if (response.data.code === 200) {
          console.log('获取配置成功:', response.data.data);
          return response.data.data;
        }
        else {
          console.error('获取配置报错:', response);
          throw new Error('获取配置失败'+response);
        }
      } catch (error) {
        console.error('获取配置出错:', error);
        throw new Error('获取配置出错'+error);
      }
      
    },
    uploadConfig: async config => {
      //使用axios发送POST请求，返回promise,将传送过来的config数据发送到后台
      console.log("api.js上传配置:",config)
      const reqData = {
        data : config
      }
      try {
        const response = await axios.post(url+'/config', reqData);
        if (response.data.code === 200) {
          console.log("配置上传成功，并返回200")
          return response.data.message;
        } else {
          console.error('存储config失败:', response);
          //return '未知';
          throw new Error('存储config失败');
        }
      } catch (error) {
        console.error('存储config异常:', error);
        //return error;
        throw new Error('存储config异常');
      }


    },
    getRobotStatus: async () => {
      try {
        const response = await axios.get(url+'/bot/status', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          
        });
        if (response.data.code === 200) {
          return response.data.data.status;
        } else {
          console.error('获取机器人状态失败:', response);
          //return '未知';
          throw new Error('获取机器人状态失败');
        }
      } catch (error) {
        console.error('获取机器人状态异常:', error);
        //return '未知';
        throw new Error('获取机器人状态异常');
      }
    },
    getQRCode: async () => {
      // 调用获取二维码的api接口http://localhost:3000/api/bot/status,get方法
      return axios.get(url+'/bot/qrcode', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        
      }).then(response => {
        if (response.data.code === 200) {
          // 生成二维码图片的选项
        const options = {
          errorCorrectionLevel: 'H',
          type: 'png',
          width: 256,
          height: 256,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        };
        return new Promise((resolve, reject) => {
          QRCode.toDataURL(response.data.data.qrcode, options, (err, url) => {
            if (err) {
              console.error('生成二维码图片时出错:', err);
              reject('生成二维码图片时出错');
            } else {
              console.log('二维码图片的 Data URL:', url);
              resolve(url);
            }
          });
        });
      } else {
        console.error('获取二维码失败:', response);
        throw new Error('获取二维码失败');
      }
    }).catch(error => {
      console.error('获取二维码失败:', error);
      throw new Error('获取二维码失败');
    });
    }
  };
  
  export default api;