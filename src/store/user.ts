import { defineStore } from 'pinia';
import { isEmpty, clone } from 'lodash';
import { logoutApi } from '@/api/user';

interface UserInfo {
  avatar: string; // 头像
  nickname: string; // 昵称
}

// 默认用户信息
const defaultUserInfo: UserInfo = {
  avatar: '', // 头像
  nickname: '' // 昵称
};

export const userStore = defineStore({
  id: 'user',
  state: () => ({
    // 用户信息
    userInfo: clone(defaultUserInfo),
    // 登录状态
    isLogin: !!uni.getStorageSync('token'),
    // 上次更新时间
    lastUpdateTime: 0
  }),
  actions: {
    // 设置个人信息
    setUserinfo(data: UserInfo) {
      this.userInfo = data;
    },
    // 设置token
    setToken(token = '') {
      if (token === '') {
        this.isLogin = false;
        uni.removeStorageSync('token');
      } else {
        this.isLogin = true;
        uni.setStorageSync('token', token);
      }
      return this.isLogin;
    },
    // 重置用户默认数据
    resetUserData() {
      this.setToken();
      this.userInfo = clone(defaultUserInfo);
    },
    // 登出
    async logout(force = false) {
      if (force) {
        this.resetUserData();
        return !this.isLogin;
      }
      const logoutRes = await logoutApi();
      if (logoutRes.code === 0) {
        this.resetUserData();
      }
      return !this.isLogin;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store'
      }
    ]
  }
});
