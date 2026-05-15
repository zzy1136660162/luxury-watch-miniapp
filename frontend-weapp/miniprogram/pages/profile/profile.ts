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
    nextLevelName: '银卡会员',
    showNicknameModal: false,
    tempNickname: ''
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
  },

  onNicknameClick() {
    this.setData!({
      showNicknameModal: true,
      tempNickname: this.data.username
    });
  },

  onNicknameInput(e: any) {
    this.setData!({
      tempNickname: e.detail.value
    });
  },

  onCancelNickname() {
    this.setData!({
      showNicknameModal: false,
      tempNickname: ''
    });
  },

  onConfirmNickname() {
    const { tempNickname } = this.data;
    
    if (!tempNickname.trim()) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (tempNickname.trim().length < 2) {
      wx.showToast({
        title: '用户名至少2个字符',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const userInfo = wx.getStorageSync('userInfo') || {};
    const userId = userInfo.id;

    wx.request({
      url: 'http://localhost:8081/wx-user/' + userId,
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        username: tempNickname.trim()
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          const newUsername = tempNickname.trim();
          
          userInfo.username = newUsername;
          wx.setStorageSync('userInfo', userInfo);

          this.setData!({
            username: newUsername,
            showNicknameModal: false,
            tempNickname: ''
          });

          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.data.msg || '修改失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('修改用户名失败:', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
