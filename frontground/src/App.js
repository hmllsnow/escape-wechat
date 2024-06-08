import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ConfigPanel from './components/ConfigPanel';
import QRCodeDisplay from './components/QRCodeDisplay';
import RobotStatus from './components/RobotStatus';
import api from './services/api';


const App = () => {
  const [robotStatus, setRobotStatus] = useState('未登录');
  const [qrCode, setQRCode] = useState(null);

  useEffect(() => {
    const fetchRobotStatus = async () => {
      try {
        const status = await api.getRobotStatus();
        setRobotStatus(status);
        if (status === '未登录') {
          const qrCode = await api.getQRCode();
          console.log('获取二维码成功:', qrCode);
          setQRCode(qrCode);
        } else {
          setQRCode(null);
        }
      } catch (error) {
        console.error('获取机器人状态或二维码失败:', error);
      }
    };

    fetchRobotStatus(); // 初始获取机器人状态和二维码

    const intervalId = setInterval(fetchRobotStatus, 5000); // 每5秒轮询一次

    return () => {
      clearInterval(intervalId); // 组件卸载时清除定时器
    };
  }, []);

  return (
    <div>
      <ControlPanel />
      <QRCodeDisplay qrCode={qrCode} />
      <RobotStatus status={robotStatus} />
      <ConfigPanel />
      
    </div>
  );
};

export default App;