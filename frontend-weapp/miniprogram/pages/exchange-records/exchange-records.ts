import { userApi } from '../../utils/request';

interface ExchangeRecord {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  productImage: string;
  points: number;
  phone: string;
  exchangeTime: string;
  status: number;
  remark: string;
}

Component({
  data: {
    records: [] as ExchangeRecord[],
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadExchangeRecords();
    },

    show() {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(-1);
      }
    }
  },

  methods: {
    async loadExchangeRecords() {
      try {
        this.setData({ loading: true });

        const res: any = await userApi.getExchangeRecords();

        if (res && res.code === 200) {
          const records = (res.data || []).map((item: any) => ({
            ...item,
            exchangeTime: this.formatDate(item.exchangeTime)
          }));

          this.setData({
            records: records,
            loading: false
          });
        } else {
          this.setData({ loading: false });
          wx.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          });
        }
      } catch (err) {
        this.setData({ loading: false });
        console.error('加载兑换记录失败:', err);
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      }
    },

    formatDate(dateStr: string): string {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    getStatusClass(status: number): string {
      const statusMap: { [key: number]: string } = {
        0: 'status-pending',
        1: 'status-completed',
        2: 'status-cancelled'
      };
      return statusMap[status] || 'status-pending';
    },

    getStatusText(status: number): string {
      const statusMap: { [key: number]: string } = {
        0: '待处理',
        1: '已完成',
        2: '已取消'
      };
      return statusMap[status] || '未知';
    },

    onBack() {
      wx.navigateBack();
    }
  }
});
