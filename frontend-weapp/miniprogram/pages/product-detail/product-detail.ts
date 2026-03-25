Component({
  data: {
    currentImageIndex: 0,
    productId: null,
    
    productImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIGZ2PSvgpfkLZ653j1G2eFgYMETUPX8pmYhtjIpsUN4IJo-RcQNlXFORfUyWHC-Onde8rXdXAK97MsC7IN7xkqIrEJ5UUmz5VGs-0imhMrp_61LRmRZGgtQGgfYDAJCPkSzTS8Z7ezkSeEjo6ABPz5iC7pJgCBkhM-8nwTo-SRt25wtm0Ulsmfd-UqRxMWVgWWUaYBBLj-_0jq54LkHF33wvlCAk0tpxktV17uGVlwgF7WS1E7t__q_xp-9T_Bjp3mNQqfnguq30T',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQ90Ry7wkGGJNCmmeD26mdP7pposk7LiRNZgY-5xoFNYD8AeegfeXTnJWsZ8IoNigXFYWX0zue9R08qakPvpOZLqs1QPgf4-QDQ_QkaxNyhG-esRiBCBpVMOl9-SLAs92jgSwzOAtbKvnhsBG4Tp2gM85E5avAD7zoJSIo56rIT1tWMeWRKSJOX0ocAcebkqIqsdrJw5lnfDkRyLt-u2pjRW1rjxPHsNbANdabYsQO8vSMFwQyu43oipCPDllz94NgFx3zZ9-9k-N',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TChx6S9aM4pUrTQHLsqh_YrV0hVvY39k6j1d6LYyy9Sy4ZAuWSRlYXNRyKxAOMdbbrsJMdBOvQPdCi4rCt85gO3w4K3OyfWhquS3chTxJWncWAV435lfc1UmrSg0G7T8ekjrqdGV_npa5bIczl6FbAhmfDW2lgjn6f4c88KO8PIQZa4CESt1lX8-xVG_FKdh0-oBYpFLBMGkT4gsjhqySvmc8AuWyqarLTqSscHudiCwAVIJQhH8jpFrLbP2SxDL7edZpEnnqPig'
    ],
    
    inspirationImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyIm9YHO312PcLT8f8sv5SzYOM-tNnE-ipXns6x-A-rgcfZn4nwFV4hpI6BuvUdROFA6gBgwq51NXo8h9R803pbXnf8TzfyDF_LwnwHLet9wuKOzcYlaGLNXiRhpi8VhbOKT9SRnab9vDFuRmsX-0nKmHSL0BPmmu0SPAV2R4r9NAMt_pKrRCKTf3rgYc5bEWL4icRE-m18QOlEi0w-T7ahiWmwWuu69iz2V3GHZeYNCJu1HX9RBAlE3RPsvko3YLt9rplj-i-i6E0',
    
    productInfo: {
      series: 'The Celestial Collection',
      name: '星空系列 - 玫瑰金版',
      subtitle: 'Starry Sky - Rose Gold Edition',
      price: 'CNY 248,000',
      highlights: [
        {
          icon: 'settings_slow_motion',
          title: '自产机芯',
          subtitle: 'In-house Movement',
          desc: '搭载 CH-700 自动上链机芯，精准卓越'
        },
        {
          icon: 'energy_savings_leaf',
          title: '动力储存',
          subtitle: 'Power Reserve',
          desc: '长达 72 小时的不间断动力保障'
        },
        {
          icon: 'waves',
          title: '防水性能',
          subtitle: 'Water Resistance',
          desc: '深达 50 米的生活与艺术平衡'
        }
      ],
      specifications: [
        { name: '表壳尺寸', nameEn: 'Case Size', value: '40 毫米 / 10.5 毫米厚度' },
        { name: '材质', nameEn: 'Material', value: '18K 玫瑰金、蓝宝石水晶玻璃' },
        { name: '机芯', nameEn: 'Movement', value: 'CH-700 自动机械机芯' },
        { name: '表带', nameEn: 'Strap', value: '密西西比鳄鱼皮 - 曜石黑' }
      ]
    }
  },

  lifetimes: {
    attached() {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          this.setData({
            productId: data.id
          });
        });
      }
    }
  },

  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage.options.id) {
        this.setData({
          productId: currentPage.options.id
        });
      }
    }
  },

  methods: {
    onImageChange(e: any) {
      this.setData({
        currentImageIndex: e.detail.current
      });
    },

    onExploreHeritage() {
      wx.navigateTo({
        url: '/pages/heritage/heritage'
      });
    },

    onConsult() {
      wx.showModal({
        title: '咨询顾问',
        content: '我们的专家将为您提供一对一的选购建议',
        confirmText: '确定'
      });
    },

    onBook() {
      wx.showModal({
        title: '预约到店',
        content: '请选择您想要预约的时间和门店',
        confirmText: '确定'
      });
    },

    onShareAppMessage() {
      return {
        title: '星空系列 - 玫瑰金版 | CHRONOS',
        path: '/pages/product-detail/product-detail',
        imageUrl: this.data.productImages[0]
      };
    }
  }
});
