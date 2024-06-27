// src/components/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authActions';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // 清除之前的错误
    try {
      const token = await api.login(password);
      dispatch(loginSuccess(token));
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError('登录失败：' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button type="submit">登录</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </form>
  );
};

export default Login;