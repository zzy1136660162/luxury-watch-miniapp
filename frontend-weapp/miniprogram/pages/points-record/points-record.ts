// 导入积分管理工具类
import { PointsManager } from '../../utils/pointsManager';

Page({
  data: {
    pointsRecords: [],
    currentPoints: 0
  },

  onLoad() {
    this.loadPointsData();
  },

  loadPointsData() {
    const userInfo = wx.getStorageSync('userInfo');
    const records = PointsManager.getPointsRecords();
    
    this.setData({
      pointsRecords: records,
      currentPoints: userInfo?.points || 0
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
});
