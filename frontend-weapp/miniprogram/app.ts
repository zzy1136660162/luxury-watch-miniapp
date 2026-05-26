// app.ts
import { apiConfig } from './utils/api-config';

App<IAppOption>({
  globalData: {
    baseUrl: apiConfig.baseUrl
  },

  onLaunch() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查并清除无效的登录状态（异步执行，不阻塞启动）
    this.checkAndClearInvalidSession();
  },

  onShow() {
    // 每次小程序显示时也检查登录状态
    this.checkAndClearInvalidSession();
  },

  checkAndClearInvalidSession() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    // 如果两者都没有，保持原状
    if (!token && !userInfo) {
      return;
    }

    // 如果只有其中一个，清除
    if ((token && !userInfo) || (!token && userInfo)) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      return;
    }

    // 如果两者都有，验证token（不阻塞，使用callback方式）
    this.verifyTokenAsync((isValid: boolean) => {
      if (!isValid) {
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
      }
    });
  },

  verifyTokenAsync(callback: (isValid: boolean) => void) {
    const token = wx.getStorageSync('token');
    if (!token) {
      callback(false);
      return;
    }

    wx.request({
      url: `${apiConfig.baseUrl}/api/user/current`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res: any) => {
        if (res.statusCode === 401 || (res.data && res.data.code === 401)) {
          callback(false);
        } else {
          callback(true);
        }
      },
      fail: () => {
        // 网络错误时，不清除登录状态，让用户可以正常使用
        callback(true);
      }
    });
  }
})
