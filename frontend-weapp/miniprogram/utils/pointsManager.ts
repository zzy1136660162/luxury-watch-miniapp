// 积分管理工具类
export class PointsManager {
  // 积分变动类型
  static readonly POINTS_TYPE = {
    SIGN_IN: 'sign_in', // 签到
    PURCHASE: 'purchase', // 购买商品
    SHARE: 'share', // 分享
    REVIEW: 'review', // 评价
    EXCHANGE: 'exchange', // 兑换
    BIRTHDAY: 'birthday', // 生日
    FIRST_PURCHASE: 'first_purchase' // 首次购买
  };

  // 积分变动记录
  static readonly POINTS_RECORD_KEY = 'points_record';

  // 获取当前积分
  static getCurrentPoints(): number {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo?.points || 0;
  }

  // 增加积分
  static addPoints(amount: number, type: string, description: string): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = wx.getStorageSync('userInfo');
        if (!userInfo) {
          reject('用户未登录');
          return;
        }

        const currentPoints = userInfo.points || 0;
        const newPoints = currentPoints + amount;

        // 更新用户信息
        userInfo.points = newPoints;
        wx.setStorageSync('userInfo', userInfo);

        // 记录积分变动
        this.addPointsRecord(amount, type, description, 'increase');



        resolve(newPoints);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 减少积分
  static deductPoints(amount: number, type: string, description: string): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = wx.getStorageSync('userInfo');
        if (!userInfo) {
          reject('用户未登录');
          return;
        }

        const currentPoints = userInfo.points || 0;
        if (currentPoints < amount) {
          reject('积分不足');
          return;
        }

        const newPoints = currentPoints - amount;

        // 更新用户信息
        userInfo.points = newPoints;
        wx.setStorageSync('userInfo', userInfo);

        // 记录积分变动
        this.addPointsRecord(amount, type, description, 'decrease');



        resolve(newPoints);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 添加积分变动记录
  static addPointsRecord(amount: number, type: string, description: string, action: 'increase' | 'decrease') {
    try {
      const records = wx.getStorageSync(this.POINTS_RECORD_KEY) || [];
      
      const record = {
        id: Date.now().toString(),
        amount,
        type,
        description,
        action,
        timestamp: new Date().toISOString(),
        balance: this.getCurrentPoints()
      };

      records.unshift(record);
      
      // 只保留最近100条记录
      if (records.length > 100) {
        records.splice(100);
      }

      wx.setStorageSync(this.POINTS_RECORD_KEY, records);
    } catch (error) {
      console.error('添加积分记录失败:', error);
    }
  }

  // 获取积分变动记录
  static getPointsRecords(): Array<any> {
    try {
      return wx.getStorageSync(this.POINTS_RECORD_KEY) || [];
    } catch (error) {
      console.error('获取积分记录失败:', error);
      return [];
    }
  }

  // 清空积分变动记录
  static clearPointsRecords() {
    try {
      wx.removeStorageSync(this.POINTS_RECORD_KEY);
    } catch (error) {
      console.error('清空积分记录失败:', error);
    }
  }

  // 初始化积分（首次登录时调用）
  static initPoints() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo && userInfo.points === undefined) {
        userInfo.points = 0;
        wx.setStorageSync('userInfo', userInfo);
      }
    } catch (error) {
      console.error('初始化积分失败:', error);
    }
  }

  // 检查是否可以兑换
  static canExchange(requiredPoints: number): boolean {
    return this.getCurrentPoints() >= requiredPoints;
  }

  // 执行兑换
  static async exchange(requiredPoints: number, rewardName: string): Promise<boolean> {
    try {
      await this.deductPoints(requiredPoints, this.POINTS_TYPE.EXCHANGE, `兑换 ${rewardName}`);
      return true;
    } catch (error) {
      console.error('兑换失败:', error);
      return false;
    }
  }

  // 签到获取积分
  static signIn(): Promise<number> {
    const signInPoints = 10;
    return this.addPoints(signInPoints, this.POINTS_TYPE.SIGN_IN, '每日签到');
  }

  // 分享获取积分
  static share(): Promise<number> {
    const sharePoints = 5;
    return this.addPoints(sharePoints, this.POINTS_TYPE.SHARE, '分享商品');
  }

  // 评价获取积分
  static review(): Promise<number> {
    const reviewPoints = 15;
    return this.addPoints(reviewPoints, this.POINTS_TYPE.REVIEW, '评价商品');
  }

  // 购买商品获取积分（按商品价格的1%计算）
  static purchase(amount: number): Promise<number> {
    const points = Math.floor(amount * 0.01);
    return this.addPoints(points, this.POINTS_TYPE.PURCHASE, `购买商品获得积分`);
  }

  // 生日礼包积分
  static birthday(): Promise<number> {
    const birthdayPoints = 100;
    return this.addPoints(birthdayPoints, this.POINTS_TYPE.BIRTHDAY, '生日礼包');
  }

  // 首次购买积分
  static firstPurchase(): Promise<number> {
    const firstPurchasePoints = 50;
    return this.addPoints(firstPurchasePoints, this.POINTS_TYPE.FIRST_PURCHASE, '首次购买奖励');
  }
}
