import { rewardApi } from '../../utils/request';

Page({
  data: {
    reward: null as any
  },

  onLoad(options: any) {
    console.log('reward-detail onLoad options:', options);

    if (options.data) {
      try {
        const rewardData = JSON.parse(decodeURIComponent(options.data));
        console.log('reward-detail rewardData:', rewardData);
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
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行兑换',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
        }
      });
      return;
    }

    console.log('开始兑换，商品信息:', this.data.reward);
    console.log('商品ID:', this.data.reward?.id, '商品标题:', this.data.reward?.title);

    wx.showModal({
      title: '兑换确认',
      content: `确定要兑换「${this.data.reward?.title}」吗？\n所需积分：${this.data.reward?.points}`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '兑换中...' });

            const result: any = await rewardApi.exchange({
              productId: this.data.reward.id
            });

            console.log('兑换接口返回:', result);

            wx.hideLoading();

            if (result.code === 200) {
              wx.showToast({
                title: '兑换成功',
                icon: 'success',
                duration: 2000
              });
              setTimeout(() => {
                wx.navigateBack();
              }, 2000);
            } else {
              wx.showToast({
                title: result.msg || '兑换失败',
                icon: 'none',
                duration: 3000
              });
            }
          } catch (err) {
            wx.hideLoading();
            console.error('兑换失败，错误详情:', err);
            wx.showToast({
              title: '兑换失败，请稍后重试',
              icon: 'none',
              duration: 3000
            });
          }
        }
      }
    });
  }
});
