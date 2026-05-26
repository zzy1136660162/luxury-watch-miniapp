Component({
  options: {
    multipleSlots: true
  },

  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    animated: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    delta: {
      type: Number,
      value: 1
    },
  },

  data: {
    displayStyle: '',
    ios: true,
    innerPaddingRight: '',
    leftWidth: '',
    safeAreaTop: ''
  },

  lifetimes: {
    attached() {
      this.initSystemInfo();
    },
    ready() {
      this.initSystemInfo();
    }
  },

  pageLifetimes: {
    show() {
      this.initSystemInfo();
    },
    resize() {
      this.initSystemInfo();
    }
  },

  methods: {
    initSystemInfo() {
      try {
        const rect = wx.getMenuButtonBoundingClientRect();
        wx.getSystemInfo({
          success: (res: any) => {
            const isAndroid = res.platform === 'android';
            const isDevtools = res.platform === 'devtools';
            
            this.setData({
              ios: !isAndroid,
              innerPaddingRight: `padding-right: ${res.windowWidth - rect.left}px`,
              leftWidth: `width: ${res.windowWidth - rect.left}px`,
              safeAreaTop: isDevtools || isAndroid ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px` : ``
            });
          },
          fail: () => {
            // 失败时使用默认值
            this.setData({
              ios: true,
              innerPaddingRight: 'padding-right: 80px',
              leftWidth: 'width: 80px',
              safeAreaTop: ''
            });
          }
        });
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    },

    _showChange(show: boolean) {
      const animated = this.data.animated;
      let displayStyle = '';
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'}; transition:opacity 0.5s;`;
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`;
      }
      this.setData({
        displayStyle
      });
    },

    back() {
      const data = this.data;
      if (data.delta) {
        wx.navigateBack({
          delta: data.delta,
          fail: () => {
            wx.switchTab({
              url: '/pages/home/home'
            });
          }
        });
      }
      this.triggerEvent('back', { delta: data.delta }, {});
    },

    home() {
      wx.switchTab({
        url: '/pages/home/home'
      });
      this.triggerEvent('home', {}, {});
    }
  },
})
