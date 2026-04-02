Page({
  data: {
    reward: null as any
  },

  onLoad(options: any) {
    if (options.data) {
      try {
        const rewardData = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          reward: rewardData
        });
      } catch (e) {
        console.error('解析礼品数据失败:', e);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onExchange() {
    wx.showModal({
      title: '兑换确认',
      content: `确定要兑换「${this.data.reward?.title}」吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '兑换成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      }
    });
  }
});
