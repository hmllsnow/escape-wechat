// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // 如果将来有其他 reducer，可以在这里添加
  },
  // configureStore 默认包含 thunk 中间件，所以不需要显式添加
});

export default store;