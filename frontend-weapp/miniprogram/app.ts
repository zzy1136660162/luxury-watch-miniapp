// app.ts
App<IAppOption>({
  globalData: {
    baseUrl: 'http://localhost:8081'
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 从后台进入时也检查登录状态
    this.checkLoginStatus();
  },

  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const currentPage = getCurrentPages();
    const isLoginPage = currentPage.length > 0 && currentPage[currentPage.length - 1]?.route?.includes('login');

    // 如果没有token且不在登录页面，跳转到登录页面
    if (!token && !isLoginPage) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
      return;
    }

    // 如果有token，验证是否有效
    if (token && !isLoginPage) {
      try {
        const isValid = await this.verifyToken();
        // 如果token无效，跳转到登录页
        if (!isValid) {
          wx.removeStorageSync('token');
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      } catch (err) {
        // 验证失败，清理token并跳转登录页
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
        url: `${this.globalData.baseUrl}/api/user/current`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('token')}`
        },
        success: (res: any) => {
          console.log('Token验证结果:', res.statusCode, res.data);
          // 如果返回401或其他未登录错误码，说明token失效
          if (res.statusCode === 401 || res.data?.code === 401) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        fail: () => {
          // 网络请求失败，假设token有效，让用户继续使用
          resolve(true);
        }
      });
    });
  }
})
