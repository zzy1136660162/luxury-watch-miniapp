import { userApi } from '../../utils/request';

interface AddressItem {
  name: string;
  phone: string;
  address: string;
}

Page({
  data: {
    addresses: [] as AddressItem[],
    showDialog: false,
    isEdit: false,
    editIndex: -1,
    formData: {
      name: '',
      phone: '',
      address: ''
    }
  },

  onLoad() {
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    console.log('userInfo:', userInfo);
    console.log('userInfo.address:', userInfo.address);
    const addressStr = userInfo.address || '';
    console.log('addressStr:', addressStr);

    if (addressStr && addressStr.trim()) {
      const addresses = addressStr.split(/[,，/\\/]/).map((addr: string) => {
        addr = addr.trim();
        if (!addr) return null;
        const parts = addr.split('|');
        console.log('parts:', parts);
        return {
          name: parts[0] || '',
          phone: parts[1] || '',
          address: parts[2] || addr
        };
      }).filter((item: AddressItem | null) => item && (item.name || item.address));

      console.log('parsed addresses:', addresses);
      this.setData!({ addresses });
    } else {
      console.log('no addresses found');
      this.setData!({ addresses: [] });
    }
  },

  onAddAddress() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData!({
      showDialog: true,
      isEdit: false,
      editIndex: -1,
      formData: {
        name: userInfo.username || '',
        phone: userInfo.phone || '',
        address: ''
      }
    });
  },

  onEditAddress(e: any) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addresses[index];

    this.setData!({
      showDialog: true,
      isEdit: true,
      editIndex: index,
      formData: {
        name: address.name,
        phone: address.phone,
        address: address.address
      }
    });
  },

  onDeleteAddress(e: any) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          const addresses = [...this.data.addresses];
          addresses.splice(index, 1);
          this.saveAddresses(addresses);
        }
      }
    });
  },

  onCloseDialog() {
    this.setData!({ showDialog: false });
  },

  onDialogTap() {
    // 阻止事件冒泡
  },

  onInputName(e: any) {
    this.setData!({ 'formData.name': e.detail.value });
  },

  onInputPhone(e: any) {
    this.setData!({ 'formData.phone': e.detail.value });
  },

  onInputAddress(e: any) {
    this.setData!({ 'formData.address': e.detail.value });
  },

  onSaveAddress() {
    const { name, phone, address } = this.data.formData;

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

    const newAddressItem = { name: name.trim(), phone: phone.trim(), address: address.trim() };
    let addresses = [...this.data.addresses];

    if (this.data.isEdit) {
      addresses[this.data.editIndex] = newAddressItem;
    } else {
      addresses.push(newAddressItem);
    }

    this.saveAddresses(addresses);
  },

  saveAddresses(addresses: AddressItem[]) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.address = addresses.map(item => `${item.name}|${item.phone}|${item.address}`).join(',');

    wx.setStorageSync('userInfo', userInfo);

    userApi.updateUserInfo({ address: userInfo.address }).then(() => {
      console.log('地址保存成功');
    }).catch((err) => {
      console.error('地址保存失败', err);
    });

    this.setData!({
      addresses,
      showDialog: false
    });

    wx.showToast({ title: '保存成功', icon: 'success' });
  }
});
