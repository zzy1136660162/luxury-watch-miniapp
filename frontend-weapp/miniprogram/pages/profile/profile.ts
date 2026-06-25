import { wxUserApi } from '../../utils/request';
import { chooseAndSaveAvatar, handleWechatAvatar, setCurrentPageInstance } from '../../utils/util';

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
    setCurrentPageInstance(this);
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
    let serverAvatar = wx.getStorageSync('serverWechatAvatar');
    const localAvatar = wx.getStorageSync('wechatAvatar');
    const token = wx.getStorageSync('token');

    // 如果是相对路径，拼接完整的图片服务器地址
    if (serverAvatar && serverAvatar.startsWith('/')) {
      serverAvatar = 'http://167.88.180.246:8081' + serverAvatar;
    }

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
    // 优先级：服务器头像 > 用户选择的本地头像 > 用户默认头像
    if (serverAvatar) {
      avatar = serverAvatar;
    } else if (localAvatar) {
      avatar = localAvatar;
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

  async onConfirmNickname() {
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

    try {
      const res = await wxUserApi.update(userId, {
        username: tempNickname.trim()
      });

      if (res.code === 200) {
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
          title: res.msg || '修改失败',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (err) {
      console.error('修改用户名失败:', err);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onAvatarTap() {
    chooseAndSaveAvatar((avatarPath) => {
      this.setData!({
        userAvatar: avatarPath
      });
    });
  },

  // 处理微信头像选择
  onWechatAvatarChoose(e: any) {
    const avatarUrl = e.detail.avatarUrl;
    handleWechatAvatar(avatarUrl, (savedPath: string) => {
      // 更新页面头像
      this.setData!({
        userAvatar: savedPath
      });
    });
  }
});
