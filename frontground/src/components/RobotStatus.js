import React from 'react';

const RobotStatus = ({ status }) => {
  return (
    <div>
      <h2>机器人状态</h2>
      <p>当前状态:{status}</p>
    </div>
  );
};

export default RobotStatus;