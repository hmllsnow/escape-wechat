import axios from 'axios';
import QRCode from 'qrcode';

const url = '/api';

// 创建一个 axios 实例
const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 设置请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('请求拦截器--->本地token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 设置响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // 可以在这里dispatch一个logout action
      // 如果你想在这里dispatch action，你需要找到一种方法来访问store
      // 例如：store.dispatch({ type: 'LOGOUT' });
    }
    return Promise.reject(error);
  }
);

const api = {
  login: async (password) => {
    try {
      const response = await axiosInstance.post('/login', { password });
      console.log('Login response:', response);
      if (response.data.code === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        return token;
      } else if (response.data.code === 401) {
        throw new Error('密码错误');
      }else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    // 如果你的后端需要处理登出，可以在这里添加一个 API 调用
    // 例如：return axiosInstance.post('/logout');
  },
  verifyToken: async (token) => {
    try {
      const response = await axiosInstance.post('/verify-token', { token });
      console.log('Verify token response:', response);
      return response.data;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  },

  startRobot: async () => {
    console.log('启动机器人');
    try {
      const response = await axiosInstance.get('/bot/start');
      if (response.data.code === 200) {
        return response.data.data.remark;
      } else if (response.data.code === 500) {
        return '进程已启动';
      } else {
        console.error('启动机器人失败:', response);
        return '未知';
      }
    } catch (error) {
      console.error('获取机器人状态失败:', error);
      return '未知';
    }
  },

  stopRobot: async () => {
    console.log('停止机器人');
    try {
      const response = await axiosInstance.get('/bot/stop');
      if (response.data.code === 200) {
        return response.data.data;
      } else if (response.data.code === 500) {
        return '进程已停止';
      } else {
        console.error('停止机器人报错:', response);
        return '未知';
      }
    } catch (error) {
      console.error('停止机器人报错:', error);
      return '未知';
    }
  },

  restartRobot: async () => {
    console.log('重启机器人');
    try {
      const response = await axiosInstance.get('/bot/restart');
      if (response.data.code === 200) {
        return response.data.data;
      } else if (response.data.code === 500) {
        return '进程已停止,请使用启动';
      } else {
        console.error('重启机器人报错:', response);
        return '未知';
      }
    } catch (error) {
      console.error('重启机器人报错:', error);
      return '未知';
    }
  },

  getConfig: async () => {
    console.log('获取配置');
    try {
      const response = await axiosInstance.get('/config');
      if (response.data.code === 200) {
        console.log('获取配置成功:', response.data.data);
        return response.data.data;
      } else {
        console.error('获取配置报错:', response);
        throw new Error('获取配置失败' + response);
      }
    } catch (error) {
      console.error('获取配置出错:', error);
      throw new Error('获取配置出错' + error);
    }
  },

  uploadConfig: async (config) => {
    console.log("api.js上传配置:", config);
    const reqData = {
      data: config
    };
    try {
      const response = await axiosInstance.post('/config', reqData);
      if (response.data.code === 200) {
        console.log("配置上传成功，并返回200");
        return response.data.message;
      } else {
        console.error('存储config失败:', response);
        throw new Error('存储config失败');
      }
    } catch (error) {
      console.error('存储config异常:', error);
      throw new Error('存储config异常');
    }
  },

  getRobotStatus: async () => {
    try {
      const response = await axiosInstance.get('/bot/status');
      if (response.data.code === 200) {
        return response.data.data.status;
      } else {
        console.error('获取机器人状态失败:', response);
        throw new Error('获取机器人状态失败');
      }
    } catch (error) {
      console.error('获取机器人状态异常:', error);
      throw new Error('获取机器人状态异常');
    }
  },

  getQRCode: async () => {
    try {
      const response = await axiosInstance.get('/bot/qrcode');
      if (response.data.code === 200) {
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
    } catch (error) {
      console.error('获取二维码失败:', error);
      throw new Error('获取二维码失败');
    }
  },
};

export default api;