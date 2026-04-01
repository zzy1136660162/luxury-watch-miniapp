interface LoginIcons {
  username: string;
  password: string;
  eyeOpen: string;
  eyeClosed: string;
}

interface LoginData {
  username: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  usernameFocus: boolean;
  passwordFocus: boolean;
  logoUrl: string;
  icons: LoginIcons;
}

Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    loading: false,
    usernameFocus: false,
    passwordFocus: false,
    logoUrl: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=CHRONOS',
    icons: {
      username: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/person_black_24dp.svg',
      password: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/lock_black_24dp.svg',
      eyeOpen: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/visibility_black_24dp.svg',
      eyeClosed: 'https://cdn.jsdelivr.net/npm/material-design-icons/svg@latest/outline/visibility_off_black_24dp.svg'
    }
  } as LoginData,

  onLoad() {
    this.checkAutoLogin();
  },

  checkAutoLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({
        url: '/pages/member/member'
      });
    }
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
    const { username, password, loading } = this.data;
    
    if (loading) return;

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

    wx.request({
      url: 'http://localhost:8081/api/mini/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        username: username.trim(),
        password: password.trim(),
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia03jQ8xswV2O7YqGh9ELz9iaERMLFiaNUjXEPiaiciaW0zRwAkHic9ib0O4A8EiaQe4ibEqiag/0',
        nickname: username.trim()
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          const userInfo = res.data.data;
          
          wx.setStorageSync('token', userInfo.token);
          wx.setStorageSync('userInfo', {
            id: userInfo.id,
            username: userInfo.username,
            avatar: userInfo.avatar,
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
