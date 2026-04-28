import { rewardApi, userApi } from '../../utils/request';

interface AddressItem {
  name: string;
  phone: string;
  address: string;
}

Page({
  data: {
    reward: null as any,
    showAddressDialog: false,
    showAddAddressDialog: false,
    addressList: [] as AddressItem[],
    selectedAddressIndex: -1,
    selectedAddress: null as AddressItem | null,
    newAddress: {
      name: '',
      phone: '',
      address: ''
    }
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

  // 解析地址字符串为地址列表
  parseAddressList(addressStr: string): AddressItem[] {
    if (!addressStr || !addressStr.trim()) {
      return [];
    }
    return addressStr.split(',').map((addr: string) => {
      addr = addr.trim();
      if (!addr) return null;
      const parts = addr.split('|');
      return {
        name: parts[0] || '',
        phone: parts[1] || '',
        address: parts[2] || addr
      };
    }).filter((item: AddressItem | null) => item && (item.name || item.address));
  },

  // 打开地址选择弹窗
  openAddressDialog() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const addressStr = userInfo.address || '';
    const addressList = this.parseAddressList(addressStr);
    this.setData({
      showAddressDialog: true,
      addressList,
      selectedAddressIndex: -1,
      selectedAddress: null
    });
  },

  // 关闭地址选择弹窗
  onCloseAddressDialog() {
    this.setData({
      showAddressDialog: false
    });
  },

  // 选择地址
  onSelectAddress(e: any) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addressList[index];
    this.setData({
      selectedAddressIndex: index,
      selectedAddress: address
    });
  },

  // 显示新增地址弹窗
  onShowAddAddress() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      showAddAddressDialog: true,
      newAddress: {
        name: userInfo.username || '',
        phone: userInfo.phone || '',
        address: ''
      }
    });
  },

  // 关闭新增地址弹窗
  onCloseAddAddressDialog() {
    this.setData({
      showAddAddressDialog: false
    });
  },

  // 输入框事件
  onInputName(e: any) {
    this.setData!({ 'newAddress.name': e.detail.value });
  },

  onInputPhone(e: any) {
    this.setData!({ 'newAddress.phone': e.detail.value });
  },

  onInputAddress(e: any) {
    this.setData!({ 'newAddress.address': e.detail.value });
  },

  // 保存新地址
  onSaveNewAddress() {
    const { name, phone, address } = this.data.newAddress;

    if (!name.trim()) {
      wx.showToast({ title: '请输入收货人', icon: 'none' });
      return;
    }

    if (!phone.trim()) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
    }

    if (!address.trim()) {
      wx.showToast({ title: '请输入详细地址', icon: 'none' });
      return;
    }

    // 保存到本地和用户表
    const userInfo = wx.getStorageSync('userInfo') || {};
    const addressList = [...this.data.addressList, { name: name.trim(), phone: phone.trim(), address: address.trim() }];
    const addressStr = addressList.map((item: AddressItem) => `${item.name}|${item.phone}|${item.address}`).join(',');
    userInfo.address = addressStr;
    wx.setStorageSync('userInfo', userInfo);

    // 调用后端更新用户地址
    userApi.updateUserInfo({ address: addressStr }).catch((err) => {
      console.error('保存地址失败', err);
    });

    this.setData({
      showAddAddressDialog: false,
      addressList
    });

    wx.showToast({ title: '地址已保存', icon: 'success' });
  },

  // 确认选择地址
  onConfirmAddress() {
    if (this.data.selectedAddressIndex === -1) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }
    this.setData({
      showAddressDialog: false
    });
    // 选择地址后执行兑换
    this.doExchange(this.data.selectedAddress);
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

    // 先打开地址选择弹窗
    this.openAddressDialog();
  },

  // 执行兑换
  doExchange(selectedAddress: AddressItem | null) {
    wx.showModal({
      title: '兑换确认',
      content: `确定要兑换「${this.data.reward?.title}」吗？\n所需积分：${this.data.reward?.points}\n收货地址：${selectedAddress?.address || '无'}`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '兑换中...' });

            const addressStr = selectedAddress ? `${selectedAddress.name}|${selectedAddress.phone}|${selectedAddress.address}` : '';

            const result: any = await rewardApi.exchange({
              productId: this.data.reward.id,
              phone: selectedAddress?.phone || '',
              address: addressStr
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
