import { getFullImageUrl, getImageUrls } from '../../utils/config';
import { productApi } from '../../utils/request';
import { PointsManager } from '../../utils/pointsManager';

Component({
  data: {
    currentImageIndex: 0,
    productId: null,

    product: null as any,

    productImages: [] as string[],

    productInfo: {
      series: '',
      name: '',
      subtitle: '',
      price: '',
      highlights: [] as any[],
      specifications: [] as any[]
    },

    brandStory: '',

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
    async loadProductDetail(id: number) {
      try {
        this.setData({ loading: true });

        const res: any = await productApi.getDetail(id);

        if (res.code === 200) {
          const product = res.data;

          let productImages: string[] = [];
          
          // 优先使用 images 字段（逗号分隔的多图）
          if (product.images) {
            productImages = getImageUrls(product.images);
          } 
          // 其次使用 image 字段
          else if (product.image) {
            productImages = getImageUrls(product.image);
          }

          const highlights: any[] = [];

          highlights.push({
            icon: 'timer',
            title: '自产机芯',
            subtitle: 'In-house Movement',
            desc: `搭载定制 ${product.code || 'Cal.900'} 动力机芯，精准卓越`
          });

          if (product.powerReserve) {
            highlights.push({
              icon: 'energy_savings_leaf',
              title: '动力储存',
              subtitle: 'Power Reserve',
              desc: `长达 ${product.powerReserve} 的不间断动力保障`
            });
          }

          if (product.waterResistance) {
            highlights.push({
              icon: 'waves',
              title: '防水性能',
              subtitle: 'Water Resistance',
              desc: `深达 ${product.waterResistance} 米的生活与艺术平衡`
            });
          }

          const specifications: any[] = [];

          if (product.caseSize) {
            specifications.push({ name: '表壳尺寸', nameEn: 'Case Size', value: product.caseSize });
          }
          if (product.material) {
            specifications.push({ name: '材质', nameEn: 'Material', value: product.material });
          }
          if (product.code) {
            specifications.push({ name: '机芯', nameEn: 'Movement', value: product.code });
          }
          if (product.strap) {
            specifications.push({ name: '表带', nameEn: 'Strap', value: product.strap });
          }

          const productInfo = {
            series: product.category || 'CHRONOS 系列',
            name: product.name,
            subtitle: product.code || '',
            price: product.price ? `¥${product.price}` : '价格面议',
            highlights,
            specifications
          };

          // 处理品牌故事图片样式和路径
          let processedBrandStory = product.brandStory || ''
          if (processedBrandStory) {
            const imageBaseUrl = 'http://localhost:8081'
            // 处理图片URL，添加完整前缀
            processedBrandStory = processedBrandStory.replace(/src=["'](\/api\/images\/[^"']+)["']/g, `src="${imageBaseUrl}$1"`)
            processedBrandStory = processedBrandStory.replace(/src=["'](\/images\/[^"']+)["']/g, `src="${imageBaseUrl}$1"`)
            processedBrandStory = processedBrandStory.replace(/src=["'](images\/[^"']+)["']/g, `src="${imageBaseUrl}/api/$1"`)
            processedBrandStory = processedBrandStory.replace(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp))["']/gi, (match, p1) => {
              if (p1.startsWith('http://') || p1.startsWith('https://')) {
                return match
              }
              return `src="${imageBaseUrl}/api/images/${p1}"`
            })
            // 添加图片样式
            processedBrandStory = processedBrandStory.replace(/<img/g, '<img style="max-width:80vw;height:auto;"')
          }

          this.setData({
            product,
            productImages,
            productInfo,
            brandStory: processedBrandStory,
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

    async onConsult() {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录后再咨询',
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

      // 显示咨询顾问弹窗
      wx.showModal({
        title: '咨询顾问',
        content: '我们的专家将为您提供一对一的选购建议',
        confirmText: '确定',
        cancelText: '取消',
        success: async (res) => {
          // 不管点击确定还是取消，都会增加积分
          try {
            await PointsManager.addPoints(1000, PointsManager.POINTS_TYPE.REVIEW, '咨询顾问');
            
            // 只有点击确定时才显示咨询成功的提示
            if (res.confirm) {
              wx.showToast({
                title: '咨询成功，获得1000积分',
                icon: 'success',
                duration: 2000
              });
            }
          } catch (error) {
            console.error('添加积分失败:', error);
          }
        }
      });
    },

    onBook() {
      wx.showModal({
        title: '预约到店',
        content: '请选择您想要预约的时间和门店',
        confirmText: '确定'
      });
    },

    onPullDownRefresh() {
      if (this.data.productId) {
        this.loadProductDetail(this.data.productId);
      }
      wx.stopPullDownRefresh();
    }
  }
});
