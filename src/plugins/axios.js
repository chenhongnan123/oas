import axios from 'axios';
const baseDomain = '';
const baseURL = `${baseDomain}`;
import store from '@/store';
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'loginType': 'INFINITY'
  }
});

axiosInstance.interceptors.request.use(function (config) {
  if (!config.url.includes('getnonworkingtime')) {
    store.commit('setting/SET_lOADING', true);
  }
  return config;
}, function (error) {
  return Promise.reject(error);//交给了catch处理
});

axiosInstance.interceptors.response.use(function (response) {
  store.commit('setting/SET_lOADING', false);
  if (response.status === 202 && response.data.errors && response.data.errors.errorCode === 'INVALID_SESSION') {
    console.log('INVALID_SESSION');
    window.location.reload();
  }
  return response;//给axios的then处理
}, function (error) {
  console.log(error, 'error');
  store.commit('setting/SET_lOADING', false);
  return Promise.reject(error);
});

export default axiosInstance;

