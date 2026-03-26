Component({
  pageLifetimes: {
    show() {
      // 设置 tabBar 选中索引为 1（系列）
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(1);
      }
    }
  },

  data: {
    currentCategory: 'classic',
    isNavFixed: false,
    navTop: 0,

    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRW-yyTD8HO8DSwBk7iBHSm1XIcuYVUCio5cpElaXYrmT_B3cas7aS0e00M0lFRRObYIkvZKIf9KwRP4UlD4V1spJVpLrT6ybD27_HX92p61RpDk1SeCHlXo1oRHseLxP__Cw7gtwGcTit6-sNsGuXGojmh1xcwEAObQdspJTTHNnEne-YnmF4Dhbpbx-pIZiGVANFX3vmwa2-qHFLsla-E8ajRjCILTsakkwqyPU3wXkIbREJ91JwwTeRGnESmJzSVJiFTx7pNBdi',

    featuredProduct1: {
      id: 'featured1',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-PRZ3aSmusA40Xy-hHoDFdh7nP5vbEDrg2xN1l_5T5uMGbDAgALQVrQ0NHTN14fpRJdon0ordgTL_T2T5xa16F57GKj6ohrUMrhYxMOHWGMG4s-zWX-2TdKh9IBLrrwvul1FbR1v5dckGZaHUrqrb30IV-GlktxBFLC7-C-yp_GFawHlU4JgIPzjfWyy3bmCLc_uDpqzbgfazRU_syVNDG8znYtwe0uOX2XlVj_6d-kSYqk71BLAmYyjPCg-76Qp3AdtB-5_KtFVV',
      title: '时空猎手',
      subtitle: 'Space Hunter Series',
      desc: '穿梭于星际阔境，精准捕捉每一瞬即逝的光阴。在极简设计中蕴含无穷的精密力学。'
    },

    featuredProduct2: {
      id: 'featured2',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH1WJBBusYkPaKuJpBkHejPwj63KjCYFA_TCAEB7d0AxVp0UtPUf69H4CsyfOYCYuiOx-6Bl_z-cpQv1t2p-o9nkdeR3LzIMyvUcxn94z8NMoFUJKy3v8fTqP5EVdVhkwedoB0Q_9k7V3XtqmakYMv5YBwOvhSsdYz43MXZOXWfI_qMoWtXudVale3dTG8mVcGj-4SrlDrTC0NwcksfxHR6oI7oomSF8mcnFAVtFPaznLH0yPocdtYuTkRRIL_fnHvGTx5GYdk5mIj',
      title: '永恒经典',
      subtitle: 'Heritage Essence',
      desc: '致敬制表黄金年代，将百年的工艺沉淀凝练于方寸表盘之间。'
    },

    product1: {
      id: '1',
      ref: 'Ref. 8820-A',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj8MEdnHrpcEdb3-XCQHT4wqbphq1KAwycSmUhCt5hugnl_BaBw0L3drS7jBs1_jcNCs15_EMS4vQAokn_g1Jx7HKDvvoHzhs_PlbW8zNrrPEVB0GadBytPysSnF7aRepQ_8PFyu4iat6aHpV4cO7y17pxonXdhTHMOoMpnUxeID0JoLIpgnJmBkK9nCRcw01Ht3vd2mCf2XeXGKUKYWKxYLPf3FTAROwgz1l9aTXl7MZyNdZBvzZZoEboRf6kUzWwLosK2jx-le9z',
      name: '曜石金·自动机械',
      subtitle: 'Obsidian Gold Automatic',
      desc: '搭载定制 Cal.900 动力机芯，配备 72 小时超长动力储存。曜石黑表盘与 18K 黄金表壳的完美邂逅，彰显沉稳不凡的气度。'
    },

    product2: {
      id: '2',
      ref: 'Ref. 5410-L',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByO0Y2WlvfmJUbd9KFAD1nXR_ETzgOY_MaxezNKuFm6IbNjG89GcDQ8XRSqkBPAkkUfgk3zU3aV5dXcA-eAe75nZoTwzJpTZFIRmN6JVtgIrAmuGLVXsJgPar5Cwu4iYUka2o9BMG84DYP37br0t0_GUItZTO6OkOGteaEBTietZaj3f3Ll2xc2t-QCJhyI6bZ59l96Eq_F8insK5POL5b2wlDnnCceB0OJX_5ZXkuS-LC-TNeQGh7JPWrKpWQH6pj2FMWPBPzXiS3',
      name: '流光银·极简主义',
      subtitle: 'Moonlight Silver Minimal',
      desc: '抛弃繁杂，回归时间的本质。极致纤薄的 5.5mm 表壳设计，采用航天级精钢材质，如同月光轻抚腕间。'
    },

    product3: {
      id: '3',
      ref: 'Ref. 9900-D',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC-hpNi4mNHp5WNLtZlSG2dm4K7zwwMnKWgiILv_6NGZmkO_omo3b6j8O7vqvTwio8uamn1LJY5DgMB-5yfYU5dwo2DYfzWmb1JH0BcsrkEE9yPUz_l5L8kANVyOs_xpaiLWDOi0elmnWAF1nnVoSCRS8n4N8TThTPuc6OBOeI_jJjcqAm8XShlXGDwvW3t43W8Ochnz4kkd6E_aWQS45goPY--T_AUOdiQLiIidnFXzsf5GrHT7ToP4MaqumhvcnsKJbTjrTWNbS',
      name: '深海之蓝·探险者',
      subtitle: 'Deep Sea Blue Explorer',
      desc: '300米专业级防水，配有陶瓷旋转表圈。深邃的蓝色放射纹表盘，在不同光线下折射出如海洋般的万千变幻。'
    }
  },

  attached() {
    // 页面加载后计算导航栏位置
    this.calculateNavPosition();
  },

  methods: {
    // 计算导航栏位置
    calculateNavPosition() {
      const query = this.createSelectorQuery();
      query.select('#category-nav').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (res && res[0] && res[1]) {
          // 计算category-nav相对于页面顶部的偏移量
          const navRect = res[0];
          const scrollOffset = res[1];
          const navOffsetTop = navRect.top + scrollOffset.scrollTop;
          this.setData({
            navTop: navOffsetTop
          });
        }
      });
    },

    // 监听滚动事件
    onScroll(e: any) {
      const scrollTop = e.detail.scrollTop;
      const { navTop, isNavFixed } = this.data;

      // 当滚动超过导航栏原始位置时，显示固定导航栏
      if (scrollTop >= navTop && !isNavFixed) {
        this.setData({ isNavFixed: true });
      } else if (scrollTop < navTop && isNavFixed) {
        this.setData({ isNavFixed: false });
      }
    },

    onCategoryTap(e: any) {
      const category = e.currentTarget.dataset.category;
      this.setData({
        currentCategory: category
      });
    },

    onProductTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/product-detail/product-detail?id=${productId}`
      });
    },

    onRequestCatalogue() {
      wx.showModal({
        title: '产品目录',
        content: '正在为您准备产品目录，请稍候...',
        confirmText: '确定'
      });
    },

    onLocateBoutique() {
      wx.showModal({
        title: '精品店定位',
        content: '正在查找附近的精品店...',
        confirmText: '确定'
      });
    }
  }
});
