Component({
  pageLifetimes: {
    show() {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(3);
      }
      this.loadUserInfo();
    }
  },

  data: {
    currentTab: 'all',
    isLoggedIn: false,
    memberPoints: '0',
    growthValue: '0',
    currentLevel: 1,
    nextLevelGrowth: 1000,
    userAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia03jQ8xswV2O7YqGh9ELz9iaERMLFiaNUjXEPiaiciaWic0aBJfNicic9ib0O4A8EiaQe4ibEqiag/0',
    userName: '游客',
    userId: '',
    memberLevelName: '普通会员',
    memberLevelEn: 'Regular Member',

    reward1: {
      id: 'reward1',
      title: '高级鳄鱼皮定制表带',
      subtitle: 'Bespoke Exotic Leather Strap',
      points: '8,000',
      image: 'D:/项目图标/member/unnamed (1).png'
    },

    reward2: {
      id: 'reward2',
      title: '品牌 200 周年纪念画册',
      subtitle: '200th Anniversary Anthology',
      points: '3,500',
      image: 'D:/项目图标/member/unnamed (4).png'
    },

    reward3: {
      id: 'reward3',
      title: '线下新品私人品鉴会门票',
      subtitle: 'Private Collection Showcase Access',
      points: '15,000',
      image: 'D:/项目图标/member/unnamed (9).png'
    },

    levelInfo: {
      1: { name: '普通会员', nameEn: 'Regular Member', min: 0, max: 999 },
      2: { name: '银卡会员', nameEn: 'Silver Member', min: 1000, max: 4999 },
      3: { name: '金卡会员', nameEn: 'Gold Member', min: 5000, max: 9999 },
      4: { name: '钻卡会员', nameEn: 'Diamond Member', min: 10000, max: Infinity }
    }
  },

  methods: {
    loadUserInfo() {
      const userInfo = wx.getStorageSync('userInfo');
      const token = wx.getStorageSync('token');

      if (token && userInfo) {
        this.setData!({
          isLoggedIn: true,
          memberPoints: userInfo.points.toString(),
          growthValue: userInfo.growthValue.toString(),
          currentLevel: userInfo.memberLevel,
          memberLevelName: userInfo.memberLevelName,
          userAvatar: userInfo.avatar || this.data.userAvatar,
          userName: userInfo.username || '用户',
          userId: userInfo.id ? `ID: ${userInfo.id.toString().padStart(8, '0')}` : ''
        });

        this.updateMemberLevelName();
        this.calculateNextLevel();
      } else {
        this.setData!({
          isLoggedIn: false
        });
      }
    },

    updateMemberLevelName() {
      const level = this.data.currentLevel;
      const levelInfo = this.data.levelInfo[level as keyof typeof this.data.levelInfo];
      if (levelInfo) {
        this.setData!({
          memberLevelName: levelInfo.name,
          memberLevelEn: levelInfo.nameEn
        });
      }
    },

    calculateNextLevel() {
      const level = this.data.currentLevel;
      const levelInfo = this.data.levelInfo[level as keyof typeof this.data.levelInfo];
      if (levelInfo && level === 4) {
        this.setData!({
          nextLevelGrowth: Infinity
        });
      } else if (levelInfo) {
        this.setData!({
          nextLevelGrowth: levelInfo.max
        });
      }
    },

    onPrivilegeTap(e: any) {
      if (!this.checkLogin()) return;

      const type = e.currentTarget.dataset.type;
      wx.showModal({
        title: '尊享权益',
        content: `正在打开 ${type} 功能`,
        confirmText: '确定'
      });
    },

    onRewardTap(e: any) {
      if (!this.checkLogin()) return;

      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/product-detail/product-detail?id=${id}`
      });
    },

    onServiceTap(e: any) {
      if (!this.checkLogin()) return;

      const type = e.currentTarget.dataset.type;
      wx.showModal({
        title: '服务功能',
        content: `正在打开 ${type} 功能`,
        confirmText: '确定'
      });
    },

    onTabChange(e: any) {
      const tab = e.currentTarget.dataset.tab;
      this.setData!({ currentTab: tab });
    },

    onLoginTap() {
      wx.navigateTo({
        url: '/pages/login/login'
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
            this.setData!({
              isLoggedIn: false,
              memberPoints: '0',
              growthValue: '0',
              currentLevel: 1,
              memberLevelName: '普通会员',
              memberLevelEn: 'Regular Member',
              userName: '游客',
              userId: ''
            });
            wx.showToast({
              title: '已退出登录',
              icon: 'success'
            });
          }
        }
      });
    },

    checkLogin(): boolean {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录后再进行操作',
          confirmText: '去登录',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login'
              });
            }
          }
        });
        return false;
      }
      return true;
    }
  }
});
