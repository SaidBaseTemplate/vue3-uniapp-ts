import type { HttpRequestConfig, HttpResponse } from 'luch-request';
import Request from 'luch-request';
import { userStore } from '@/store/user';

interface ApiResponse<T> {
  data: T;
  msg: string;
  code: number;
}

/**
 * @description 请求基础配置 可直接使用访问自定义请求
 */
const http = new Request({
  baseURL: import.meta.env.VITE_BASE_SERVER_URL,
  timeout: 8000,
  method: 'GET',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

/**
 * @description 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    // 需要鉴权但未登录
    if (config.custom && config.custom.auth && !userStore().isLogin) {
      return Promise.reject();
    }
    // 添加token到header
    const token = uni.getStorageSync('token');
    if (token && config.header) config.header['Authorization'] = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @description 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    // 自动设置登陆令牌
    if (response.header.authorization || response.header.Authorization) {
      userStore().setToken(response.header.authorization || response.header.Authorization);
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    const isLogin = userStore().isLogin;
    let errorMessage = '网络请求出错';
    if (error !== undefined) {
      switch (error.statusCode) {
        case 400:
          errorMessage = '请求错误';
          break;
        case 401:
          if (isLogin) {
            errorMessage = '您的登录已过期';
          } else {
            errorMessage = '请先登录';
          }
          userStore().logout(true);
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求出错';
          break;
        case 408:
          errorMessage = '请求超时';
          break;
        case 429:
          errorMessage = '请求频繁, 请稍后再访问';
          break;
        case 500:
          errorMessage = '服务器开小差啦,请稍后再试~';
          break;
        case 501:
          errorMessage = '服务未实现';
          break;
        case 502:
          errorMessage = '网络错误';
          break;
        case 503:
          errorMessage = '服务不可用';
          break;
        case 504:
          errorMessage = '网络超时';
          break;
        case 505:
          errorMessage = 'HTTP版本不受支持';
          break;
      }
      if (error.errMsg.includes('timeout')) errorMessage = '请求超时';
    }
    return false;
  }
);

const request = <T>(config: HttpRequestConfig): Promise<HttpResponse<T> & ApiResponse<T>> => {
  return http.middleware(config);
};

export default request;
