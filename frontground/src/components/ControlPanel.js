import React from 'react';
import api from '../services/api';

const ControlPanel = () => {
  const handleStart = () => {
    api.startRobot();
  };

  const handleStop = () => {
    api.stopRobot();
  };

  const handleRestart = () => {
    api.restartRobot();
  };

  return (
    <div>
      <h2>控制区</h2>
      <button onClick={handleStart}>启动</button>
      <button onClick={handleStop}>停止</button>
      <button onClick={handleRestart}>重启</button>
    </div>
  );
};

export default ControlPanel;