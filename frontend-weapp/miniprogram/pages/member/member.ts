// 导入积分管理工具类
import { PointsManager } from '../../utils/pointsManager';

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
    userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    userName: '游客',
    userId: '',
    memberLevelName: '普通会员',
    memberLevelEn: 'Regular Member',

    reward1: {
      id: 'reward1',
      title: '高级鳄鱼皮定制表带',
      subtitle: 'Bespoke Exotic Leather Strap',
      points: '8,000',
      image: 'http://localhost:8081/api/images/unnamed%20(1).png'
    },

    reward2: {
      id: 'reward2',
      title: '品牌 200 周年纪念画册',
      subtitle: '200th Anniversary Anthology',
      points: '3,500',
      image: 'http://localhost:8081/api/images/unnamed%20(4).png'
    },

    reward3: {
      id: 'reward3',
      title: '线下新品私人品鉴会门票',
      subtitle: 'Private Collection Showcase Access',
      points: '15,000',
      image: 'http://localhost:8081/api/images/unnamed%20(9).png'
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
      const wechatAvatar = wx.getStorageSync('wechatAvatar');

      if (token && userInfo) {
        // 初始化积分（如果未设置）
        PointsManager.initPoints();
        
        const level = userInfo.memberLevel || 1;
        const levelInfo = this.data.levelInfo[level as keyof typeof this.data.levelInfo] || this.data.levelInfo[1];

        let avatarUrl = this.data.userAvatar;
        if (wechatAvatar) {
          avatarUrl = wechatAvatar;
        } else if (userInfo.avatar) {
          avatarUrl = userInfo.avatar;
        }

        this.setData!({
          isLoggedIn: true,
          memberPoints: (userInfo.points || 0).toString(),
          growthValue: (userInfo.growthValue || 0).toString(),
          currentLevel: level,
          memberLevelName: levelInfo.name,
          memberLevelEn: levelInfo.nameEn,
          userAvatar: avatarUrl,
          userName: userInfo.username || '用户',
          userId: userInfo.id ? `ID: ${userInfo.id.toString().padStart(8, '0')}` : ''
        });

        this.calculateNextLevel();
      } else {
        this.setData!({
          isLoggedIn: false,
          pointsRecords: []
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
      
      if (type === 'priority') {
        wx.navigateTo({
          url: '/pages/appointment/appointment'
        });
        return;
      }
      
      wx.showModal({
        title: '尊享权益',
        content: `正在打开 ${type} 功能`,
        confirmText: '确定'
      });
    },

    onRewardTap(e: any) {
      if (!this.checkLogin()) return;

      const id = e.currentTarget.dataset.id;
      let rewardData = null;
      
      if (id === 'reward1') {
        rewardData = this.data.reward1;
      } else if (id === 'reward2') {
        rewardData = this.data.reward2;
      } else if (id === 'reward3') {
        rewardData = this.data.reward3;
      }
      
      if (rewardData) {
        wx.navigateTo({
          url: `/pages/reward-detail/reward-detail?data=${encodeURIComponent(JSON.stringify(rewardData))}`
        });
      }
    },

    onServiceTap(e: any) {
      if (!this.checkLogin()) return;

      const type = e.currentTarget.dataset.type;
      
      switch (type) {
        case 'appointments':
          wx.navigateTo({
            url: '/pages/appointment-list/appointment-list'
          });
          break;
        case 'records':
          wx.navigateTo({
            url: '/pages/exchange-records/exchange-records'
          });
          break;
        case 'consultant':
          wx.showToast({ title: '功能开发中', icon: 'none' });
          break;
        case 'address':
          wx.showToast({ title: '功能开发中', icon: 'none' });
          break;
        default:
          wx.showToast({ title: '功能开发中', icon: 'none' });
      }
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

    onSettingsTap() {
      wx.navigateTo({
        url: '/pages/settings/settings'
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
              userId: '',
              pointsRecords: []
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
    },

    // 点击积分记录按钮
    onPointsRecordTap() {
      if (!this.checkLogin()) return;
      
      wx.navigateTo({
        url: '/pages/points-record/points-record'
      });
    },

    // 点击兑换按钮
    async onRedeemTap(e: any) {
      if (!this.checkLogin()) return;
      
      const rewardId = e.currentTarget.dataset.id;
      let rewardData = null;
      let points = 0;
      
      if (rewardId === 'reward1') {
        rewardData = this.data.reward1;
        points = parseInt(rewardData.points.replace(/,/g, ''));
      } else if (rewardId === 'reward2') {
        rewardData = this.data.reward2;
        points = parseInt(rewardData.points.replace(/,/g, ''));
      } else if (rewardId === 'reward3') {
        rewardData = this.data.reward3;
        points = parseInt(rewardData.points.replace(/,/g, ''));
      }
      
      if (rewardData) {
        const userInfo = wx.getStorageSync('userInfo');
        const currentPoints = userInfo?.points || 0;
        
        if (currentPoints < points) {
          wx.showToast({
            title: '积分不足',
            icon: 'none'
          });
          return;
        }
        
        wx.showModal({
          title: '确认兑换',
          content: `确定要使用 ${points} 积分兑换 ${rewardData.title} 吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                const newPoints = await PointsManager.deductPoints(points, PointsManager.POINTS_TYPE.EXCHANGE, `兑换 ${rewardData.title}`);
                this.setData!({ memberPoints: newPoints.toString() });
                wx.showToast({
                  title: '兑换成功',
                  icon: 'success'
                });
              } catch (error) {
                wx.showToast({
                  title: '兑换失败',
                  icon: 'none'
                });
              }
            }
          }
        });
      }
    }
  }
});
