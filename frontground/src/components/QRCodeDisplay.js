import React from 'react';

const QRCodeDisplay = ({ qrCode }) => {
  console.log('QRCodeDisplay',qrCode);
  return (
    <div>
      <h2>微信登录二维码</h2>
      {qrCode ? (
        <img src={qrCode} alt="QR Code" />
      ) : (
        <p>机器人已登录或进程未启动,无需显示二维码</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;