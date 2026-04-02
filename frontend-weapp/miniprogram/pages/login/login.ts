interface LoginIcons {
  phone: string;
  username: string;
  password: string;
  eyeOpen: string;
  eyeClosed: string;
}

interface LoginData {
  username: string;
  password: string;
  phone: string;
  showPassword: boolean;
  loading: boolean;
  usernameFocus: boolean;
  passwordFocus: boolean;
  phoneFocus: boolean;
  hasAvatar: boolean;
  avatarUrl: string;
  logoUrl: string;
  icons: LoginIcons;
}

Page({
  data: {
    username: '',
    password: '',
    phone: '',
    showPassword: false,
    loading: false,
    usernameFocus: false,
    passwordFocus: false,
    phoneFocus: false,
    hasAvatar: false,
    avatarUrl: '',
    logoUrl: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=CHRONOS',
    icons: {
      phone: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/phone_android.svg',
      username: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/person_black_24dp.svg',
      password: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/lock_black_24dp.svg',
      eyeOpen: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/visibility_black_24dp.svg',
      eyeClosed: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/visibility_off_black_24dp.svg'
    }
  } as LoginData,

  onLoad() {
    this.checkAutoLogin();
    this.loadSavedAvatar();
  },

  checkAutoLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({
        url: '/pages/member/member'
      });
    }
  },

  loadSavedAvatar() {
    const savedAvatar = wx.getStorageSync('wechatAvatar');
    if (savedAvatar) {
      this.setData!({
        hasAvatar: true,
        avatarUrl: savedAvatar
      });
    }
  },

  onChooseAvatar(e: any) {
    const avatarUrl = e.detail.avatarUrl;
    
    if (avatarUrl) {
      wx.showLoading({ title: '处理中...' });
      
      this.saveAvatar(avatarUrl);
    }
  },

  saveAvatar(avatarUrl: string) {
    if (avatarUrl.startsWith('http://temp') || avatarUrl.startsWith('wxfile://')) {
      wx.getFileSystemManager().saveFile({
        tempFilePath: avatarUrl,
        success: (res) => {
          const savedPath = res.savedFilePath;
          wx.setStorageSync('wechatAvatar', savedPath);
          
          this.setData!({
            hasAvatar: true,
            avatarUrl: savedPath
          });
          
          wx.hideLoading();
          wx.showToast({
            title: '头像已获取',
            icon: 'success',
            duration: 1500
          });
        },
        fail: () => {
          wx.hideLoading();
          this.setData!({
            hasAvatar: true,
            avatarUrl: avatarUrl
          });
          wx.setStorageSync('wechatAvatar', avatarUrl);
        }
      });
    } else {
      wx.downloadFile({
        url: avatarUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            const tempPath = res.tempFilePath;
            wx.getFileSystemManager().saveFile({
              tempFilePath: tempPath,
              success: (saveRes) => {
                const savedPath = saveRes.savedFilePath;
                wx.setStorageSync('wechatAvatar', savedPath);
                
                this.setData!({
                  hasAvatar: true,
                  avatarUrl: savedPath
                });
                
                wx.hideLoading();
                wx.showToast({
                  title: '头像已获取',
                  icon: 'success',
                  duration: 1500
                });
              },
              fail: () => {
                wx.hideLoading();
                this.setData!({
                  hasAvatar: true,
                  avatarUrl: tempPath
                });
                wx.setStorageSync('wechatAvatar', tempPath);
              }
            });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '头像获取失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  onPhoneInput(e: any) {
    this.setData!({
      phone: e.detail.value
    });
  },

  onPhoneFocus() {
    this.setData!({
      phoneFocus: true
    });
  },

  onPhoneBlur() {
    this.setData!({
      phoneFocus: false
    });
  },

  onUsernameInput(e: any) {
    this.setData!({
      username: e.detail.value
    });
  },

  onPasswordInput(e: any) {
    this.setData!({
      password: e.detail.value
    });
  },

  onUsernameFocus() {
    this.setData!({
      usernameFocus: true
    });
  },

  onUsernameBlur() {
    this.setData!({
      usernameFocus: false
    });
  },

  onPasswordFocus() {
    this.setData!({
      passwordFocus: true
    });
  },

  onPasswordBlur() {
    this.setData!({
      passwordFocus: false
    });
  },

  togglePasswordVisibility() {
    this.setData!({
      showPassword: !this.data.showPassword
    });
  },

  onLogin() {
    const { username, password, phone, loading, avatarUrl } = this.data;
    
    if (loading) return;

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData!({ loading: true });

    const wechatAvatar = wx.getStorageSync('wechatAvatar') || avatarUrl;

    wx.request({
      url: 'http://localhost:8081/api/mini/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        username: username.trim(),
        password: password.trim(),
        phone: phone.trim(),
        avatar: wechatAvatar || 'https://img.yzcdn.cn/vant/cat.jpeg',
        nickname: username.trim(),
        wechatAvatar: wechatAvatar
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          const userInfo = res.data.data;
          
          wx.setStorageSync('token', userInfo.token);
          wx.setStorageSync('userInfo', {
            id: userInfo.id,
            username: userInfo.username,
            avatar: userInfo.avatar,
            phone: userInfo.phone || phone.trim(),
            points: userInfo.points,
            growthValue: userInfo.growthValue,
            memberLevel: userInfo.memberLevel,
            memberLevelName: userInfo.memberLevelName
          });

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });

          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              wx.navigateBack();
            } else {
              wx.switchTab({
                url: '/pages/member/member'
              });
            }
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.msg || '登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('登录请求失败:', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
      },
      complete: () => {
        this.setData!({ loading: false });
      }
    });
  },

  onUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      confirmText: '确定'
    });
  },

  onPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      confirmText: '确定'
    });
  }
});
