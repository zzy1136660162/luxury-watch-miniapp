import { storeApi, appointmentApi } from '../../utils/request';

Component({
  data: {
    stores: [] as any[],
    selectedStoreId: null as number | null,
    selectedStore: null as any,
    selectedDate: '',
    selectedTime: '',
    timeSlots: [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ],
    tomorrowDate: ''
  },

  lifetimes: {
    attached() {
      this.initDate();
      this.loadStores();
    }
  },

  methods: {
    onBack() {
      wx.navigateBack();
    },

    initDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      this.setData!({
        tomorrowDate: `${year}-${month}-${day}`
      });
    },

    async loadStores() {
      try {
        const res: any = await storeApi.getList();
        if (res.code === 200) {
          this.setData!({ stores: res.data });
        }
      } catch (error) {
        console.error('加载门店列表失败:', error);
      }
    },

    onStoreSelect(e: any) {
      const store = e.currentTarget.dataset.store;
      this.setData!({
        selectedStoreId: store.id,
        selectedStore: store
      });
    },

    onDateChange(e: any) {
      this.setData!({ selectedDate: e.detail.value });
    },

    onTimeSelect(e: any) {
      this.setData!({ selectedTime: e.currentTarget.dataset.time });
    },

    async onSubmitBooking() {
      if (!this.data.selectedStoreId) {
        wx.showToast({ title: '请选择门店', icon: 'none' });
        return;
      }
      if (!this.data.selectedDate) {
        wx.showToast({ title: '请选择日期', icon: 'none' });
        return;
      }
      if (!this.data.selectedTime) {
        wx.showToast({ title: '请选择时间', icon: 'none' });
        return;
      }

      try {
        wx.showLoading({ title: '提交中...' });
        const res: any = await appointmentApi.create({
          storeId: this.data.selectedStoreId!,
          appointmentDate: this.data.selectedDate,
          appointmentTime: this.data.selectedTime
        });
        
        wx.hideLoading();
        
        if (res.code === 200) {
          wx.showModal({
            title: '预约成功',
            content: '您的预约已提交，请按时到店体验',
            showCancel: false,
            success: () => {
              wx.navigateBack();
            }
          });
        } else {
          wx.showToast({ title: res.msg || '预约失败', icon: 'none' });
        }
      } catch (error: any) {
        wx.hideLoading();
        wx.showToast({ title: error.message || '预约失败', icon: 'none' });
      }
    }
  }
});
