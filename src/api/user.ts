import request from '@/common/request';

interface LoginParams {}

// 登录
export const loginApi = (data: LoginParams) =>
  request({
    url: '/user/login',
    method: 'POST',
    custom: {
      auth: false
    },
    data
  });

export const logoutApi = () =>
  request({
    url: '/user/logout',
    method: 'POST',
    custom: {
      auth: false
    }
  });

export const profileApi = () => {};
