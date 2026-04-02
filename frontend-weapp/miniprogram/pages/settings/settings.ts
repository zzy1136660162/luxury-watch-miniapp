Page({
  onLoad() {
    this.checkLogin();
  },

  onShow() {
    this.checkLogin();
  },

  onBack() {
    wx.navigateBack();
  },

  checkLogin() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          } else {
            wx.navigateBack();
          }
        }
      });
    }
  },

  onProfileTap() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  onLogoutTap() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('wechatAvatar');
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }
});
