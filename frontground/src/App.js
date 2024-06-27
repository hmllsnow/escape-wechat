import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './redux/store';
import ControlPanel from './components/ControlPanel';
import ConfigPanel from './components/ConfigPanel';
import QRCodeDisplay from './components/QRCodeDisplay';
import RobotStatus from './components/RobotStatus';
import Login from './components/Login';
import LogoutButton from './components/LogoutButton';
import PrivateRoute from './components/PrivateRoute';
import api from './services/api';
import { loginSuccess } from './redux/authActions';

const MainApp = () => {
  const [robotStatus, setRobotStatus] = useState('未登录');
  const [qrCode, setQRCode] = useState(null);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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

    if (isAuthenticated) {
      fetchRobotStatus(); // 初始获取机器人状态和二维码
      const intervalId = setInterval(fetchRobotStatus, 5000); // 每5秒轮询一次
      return () => {
        clearInterval(intervalId); // 组件卸载时清除定时器
      };
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated && <LogoutButton />}
      <ControlPanel />
      <QRCodeDisplay qrCode={qrCode} />
      <RobotStatus status={robotStatus} />
      <ConfigPanel />
    </div>
  );
};

// const AppContent = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           await api.verifyToken(token);
//           console.log('Token验证成功');
//           dispatch(loginSuccess(token));
//         } catch (error) {
//           localStorage.removeItem('token');
//         }
//       }
//     };

//     verifyToken();
//   }, [dispatch]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<PrivateRoute />}>
//           <Route index element={<MainApp />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

const AppContent = () => {
  const dispatch = useDispatch();
  //const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.verifyToken(token);
          console.log('Token验证成功');
          dispatch(loginSuccess(token));
       //   console.log('Token验证成功后,状态:', authState);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    verifyToken();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<MainApp />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;