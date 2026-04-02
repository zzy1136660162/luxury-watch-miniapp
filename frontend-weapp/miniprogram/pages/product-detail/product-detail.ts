import { getFullImageUrl } from '../../utils/config';
import { productApi } from '../../utils/request';

Component({
  data: {
    currentImageIndex: 0,
    productId: null,

    // 商品数据
    product: null as any,

    // 商品图片列表
    productImages: [] as string[],

    // 商品基本信息
    productInfo: {
      series: '',
      name: '',
      subtitle: '',
      price: '',
      highlights: [] as any[],
      specifications: [] as any[]
    },

    // 加载状态
    loading: true
  },

  lifetimes: {
    attached() {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          if (data.id) {
            this.setData({
              productId: data.id
            });
            this.loadProductDetail(data.id);
          }
        });
      }
    }
  },

  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage.options.id) {
        const productId = parseInt(currentPage.options.id);
        this.setData({
          productId
        });
        this.loadProductDetail(productId);
      }
    }
  },

  methods: {
    // 加载商品详情
    async loadProductDetail(id: number) {
      try {
        this.setData({ loading: true });

        const res: any = await productApi.getDetail(id);

        if (res.code === 200) {
          const product = res.data;

          // 处理商品图片
          let productImages: string[] = [];
          if (product.images) {
            try {
              // 尝试解析images字段（可能是JSON数组）
              const imagesArray = JSON.parse(product.images);
              productImages = imagesArray.map((img: string) => getFullImageUrl(img));
            } catch (e) {
              // 如果不是JSON，就当作单个图片处理
              productImages = [getFullImageUrl(product.images)];
            }
          } else if (product.image) {
            // 使用主图
            productImages = [getFullImageUrl(product.image)];
          }

          // 构建商品信息
          const productInfo = {
            series: product.category || 'CHRONOS 系列',
            name: product.name,
            subtitle: product.code || '',
            price: product.price ? `¥${product.price}` : '价格面议',
            highlights: [
              {
                icon: 'timer',
                title: '自产机芯',
                subtitle: 'In-house Movement',
                desc: '搭载定制 Cal.900 动力机芯，精准卓越'
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
              { name: '商品编码', nameEn: 'Code', value: product.code || '-' },
              { name: '商品分类', nameEn: 'Category', value: product.category || '-' },
              { name: '库存数量', nameEn: 'Stock', value: product.stock ? `${product.stock} 件` : '有货' },
              { name: '销量', nameEn: 'Sales', value: product.sales ? `${product.sales} 件` : '0 件' }
            ]
          };

          this.setData({
            product,
            productImages,
            productInfo,
            loading: false
          });

          console.log('商品详情加载成功', product.name);
        } else {
          console.error('API返回错误:', res.msg);
          this.showError();
        }
      } catch (error) {
        console.error('加载商品详情失败:', error);
        this.showError();
      }
    },

    // 显示错误提示
    showError() {
      this.setData({ loading: false });
      wx.showToast({
        title: '商品加载失败',
        icon: 'none',
        duration: 2000
      });
    },

    onImageChange(e: any) {
      this.setData({
        currentImageIndex: e.detail.current
      });
    },

    onExploreHeritage() {
      wx.switchTab({
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
      const { product, productImages } = this.data;
      return {
        title: product ? `${product.name} | CHRONOS` : 'CHRONOS 奢侈品腕表',
        path: `/pages/product-detail/product-detail?id=${this.data.productId}`,
        imageUrl: productImages[0] || ''
      };
    },

    // 下拉刷新
    onPullDownRefresh() {
      if (this.data.productId) {
        this.loadProductDetail(this.data.productId).then(() => {
          wx.stopPullDownRefresh();
        });
      } else {
        wx.stopPullDownRefresh();
      }
    }
  }
});
