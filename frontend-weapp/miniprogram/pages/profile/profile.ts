Page({
  data: {
    userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    username: '',
    phone: '',
    points: 0,
    growthValue: 0,
    memberLevel: 1,
    memberLevelName: '普通会员',
    nextLevelGrowth: 1000,
    nextLevelName: '银卡会员'
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  onBack() {
    wx.navigateBack();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const wechatAvatar = wx.getStorageSync('wechatAvatar');
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
      return;
    }

    const levelInfo = {
      1: { name: '普通会员', nextGrowth: 1000, nextName: '银卡会员' },
      2: { name: '银卡会员', nextGrowth: 5000, nextName: '金卡会员' },
      3: { name: '金卡会员', nextGrowth: 10000, nextName: '钻卡会员' },
      4: { name: '钻卡会员', nextGrowth: 0, nextName: '' }
    };

    const level = userInfo.memberLevel || 1;
    const currentLevelInfo = levelInfo[level] || levelInfo[1];

    let avatar = this.data.userAvatar;
    if (wechatAvatar) {
      avatar = wechatAvatar;
    } else if (userInfo.avatar) {
      avatar = userInfo.avatar;
    }

    this.setData!({
      userAvatar: avatar,
      username: userInfo.username || '用户',
      phone: userInfo.phone || '未设置',
      points: userInfo.points || 0,
      growthValue: userInfo.growthValue || 0,
      memberLevel: level,
      memberLevelName: currentLevelInfo.name,
      nextLevelGrowth: currentLevelInfo.nextGrowth,
      nextLevelName: currentLevelInfo.nextName
    });
  }
});
