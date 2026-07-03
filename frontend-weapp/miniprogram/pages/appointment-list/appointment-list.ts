import { appointmentApi } from '../../utils/request';

Component({
  data: {
    appointments: [] as any[],
    loading: false
  },

  lifetimes: {
    attached() {
      this.loadMyAppointments();
    }
  },

  pageLifetimes: {
    show() {
      this.loadMyAppointments();
    }
  },

  methods: {
    onBack() {
      wx.navigateBack();
    },

    async loadMyAppointments() {
      // 检查登录状态
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录后再查看预约',
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

      try {
        this.setData!({ loading: true });
        const res: any = await appointmentApi.getMyList();
        if (res.code === 200) {
          this.setData!({
            appointments: res.data
          });
        }
      } catch (error) {
        console.error('加载预约列表失败:', error);
        wx.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.setData!({ loading: false });
      }
    },

    onCancelAppointment(e: any) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '取消预约',
        content: '确定要取消这个预约吗？',
        success: (res) => {
          if (res.confirm) {
            this.doCancel(id);
          }
        }
      });
    },

    async doCancel(id: number) {
      try {
        wx.showLoading({ title: '取消中...' });
        const res: any = await appointmentApi.cancel(id);
        wx.hideLoading();
        
        if (res.code === 200) {
          wx.showToast({ title: '已取消预约' });
          this.loadMyAppointments();
        } else {
          wx.showToast({ title: res.msg || '取消失败', icon: 'none' });
        }
      } catch (error) {
        wx.hideLoading();
        wx.showToast({ title: '取消失败', icon: 'none' });
      }
    },

    onGoBooking() {
      wx.navigateTo({
        url: '/pages/appointment/appointment'
      });
    }
  }
});
