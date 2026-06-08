import { wxUserApi } from './request';

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

// 用于存储头像选择的回调函数
let avatarCallback: ((avatarPath: string) => void) | null = null;
// 用于存储当前页面实例
let currentPageInstance: any = null;

/**
 * 注册头像选择回调（需要在 Page/Component 中调用）
 */
export const registerAvatarCallback = (callback: (avatarPath: string) => void) => {
  avatarCallback = callback;
};

/**
 * 设置当前页面实例（由页面 onLoad 时调用）
 */
export const setCurrentPageInstance = (page: any) => {
  currentPageInstance = page;
};

/**
 * 处理微信头像选择结果（由页面组件调用）
 */
export const handleWechatAvatar = (avatarUrl: string, callback?: (path: string) => void) => {
  if (!avatarUrl) return;

  console.log('头像 URL:', avatarUrl);

  wx.showLoading({ title: '处理中...' });

  // 直接使用原始路径保存（和 login.ts 一样）
  wx.getFileSystemManager().saveFile({
    tempFilePath: avatarUrl,
    success: (res) => {
      const savedPath = res.savedFilePath;
      console.log('头像保存成功:', savedPath);
      // 保存到本地
      wx.setStorageSync('wechatAvatar', savedPath);
      // 上传到服务器
      uploadAvatarToServer(savedPath, callback);
      wx.hideLoading();
    },
    fail: (err) => {
      console.error('保存头像失败:', err);
      wx.hideLoading();
      wx.showToast({
        title: '头像保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
};

/**
 * 上传头像到服务器
 */
const uploadAvatarToServer = (filePath: string, callback?: (path: string) => void) => {
  wx.showLoading({ title: '上传中...' });

  wxUserApi.uploadAvatar(filePath).then((res: any) => {
    wx.hideLoading();
    if (res.code === 200) {
      const serverAvatarUrl = res.data;
      console.log('服务器返回的头像URL:', serverAvatarUrl);
      console.log('完整响应数据:', res);
      // 保存服务器返回的头像 URL
      wx.setStorageSync('serverWechatAvatar', serverAvatarUrl);
      wx.showToast({
        title: '头像已更新',
        icon: 'success',
        duration: 1500
      });
      // 使用服务器 URL 更新页面
      if (callback) {
        callback(serverAvatarUrl);
      }
      if (avatarCallback) {
        avatarCallback(serverAvatarUrl);
      }
      // 延迟刷新当前页面，确保 storage 已经保存
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          // 直接调用 onShow 刷新页面数据
          currentPage.onShow && currentPage.onShow();
          // 如果有 loadUserInfo 方法，调用它重新加载
          if (currentPage.loadUserInfo) {
            currentPage.loadUserInfo();
          }
        }
      }, 100);
    } else {
      wx.showToast({
        title: res.msg || '头像保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  }).catch((err) => {
    wx.hideLoading();
    console.error('上传头像失败:', err);
    wx.showToast({
      title: '头像上传失败',
      icon: 'none',
      duration: 2000
    });
  });
};

/**
 * 获取微信头像并保存
 * @param callback 回调函数，接收保存后的头像路径
 */
export const chooseAndSaveAvatar = (callback: (avatarPath: string) => void) => {
  avatarCallback = callback;

  // 弹出选择框
  wx.showActionSheet({
    itemList: ['从相册选择', '获取微信头像'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 从相册选择
        chooseFromAlbum(callback);
      } else if (res.tapIndex === 1) {
        // 获取微信头像
        triggerChooseAvatar();
      }
    },
    fail: () => {
      // 用户取消选择
    }
  });
};

/**
 * 从相册选择图片
 */
const chooseFromAlbum = (callback: (avatarPath: string) => void) => {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFiles[0].tempFilePath;
      console.log('相册图片路径:', tempFilePath);
      // 相册选择的临时文件路径，需要先保存到本地再上传
      wx.showLoading({ title: '处理中...' });
      wx.getFileSystemManager().saveFile({
        tempFilePath: tempFilePath,
        success: (saveRes) => {
          const savedPath = saveRes.savedFilePath;
          console.log('相册图片保存成功:', savedPath);
          // 保存到本地
          wx.setStorageSync('wechatAvatar', savedPath);
          // 上传到服务器，传入回调函数
          uploadAvatarToServer(savedPath, (serverAvatarUrl) => {
            // 上传成功后，调用原始回调
            if (callback) {
              callback(serverAvatarUrl);
            }
          });
          wx.hideLoading();
        },
        fail: (err) => {
          console.error('保存相册图片失败:', err);
          wx.hideLoading();
          wx.showToast({
            title: '头像保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    fail: () => {
      // 用户取消选择
    }
  });
};

/**
 * 触发微信头像选择
 */
const triggerChooseAvatar = () => {
  // 使用微信小程序提供的 chooseAvatar API（基础库 2.24.0+）
  if (typeof wx.chooseAvatar === 'function') {
    (wx as any).chooseAvatar({
      choiceAvatarType: 'both',
      success: (res: any) => {
        handleWechatAvatar(res.avatarUrl);
      },
      fail: () => {
        // 用户取消选择
      }
    });
  } else {
    // 基础库版本过低，显示提示
    wx.showToast({
      title: '微信版本过低',
      icon: 'none',
      duration: 2000
    });
  }
};

/**
 * 获取保存的头像路径
 */
export const getSavedAvatar = (): string => {
  return wx.getStorageSync('wechatAvatar') || '';
}
