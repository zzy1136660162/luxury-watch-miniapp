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

    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const currentPage = getCurrentPages();
    const lastPage = currentPage.length > 0 ? currentPage[currentPage.length - 1] : null;
    const isLoginPage = lastPage && lastPage.route && lastPage.route.indexOf('login') > -1;

    if (!token && !isLoginPage) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
      return;
    }

    if (token && !isLoginPage) {
      try {
        const isValid = await this.verifyToken();
        if (!isValid) {
          wx.removeStorageSync('token');
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      } catch (err) {
        wx.removeStorageSync('token');
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  },

  verifyToken(): Promise<boolean> {
    return new Promise((resolve) => {
      wx.request({
        url: `${apiConfig.baseUrl}/api/user/current`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('token')}`
        },
        success: (res: any) => {
          console.log('Token验证结果:', res.statusCode, res.data);
          if (res.statusCode === 401 || (res.data && res.data.code === 401)) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        fail: () => {
          resolve(true);
        }
      });
    });
  }
})
