// src/redux/authActions.js
export const loginSuccess = (token) => ({
    type: 'LOGIN_SUCCESS',
    payload: token,
  });
  
  export const logout = () => ({
    type: 'LOGOUT',
  });