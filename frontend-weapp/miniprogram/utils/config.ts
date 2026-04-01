/**
 * 小程序配置文件
 * 包含图片前缀等配置信息
 * 参考后端管理平台的图片处理方式
 */

// 图片访问基础配置
const imageConfig = {
  // 小程序专用图片访问前缀（与后端 base-url 配置保持一致）
  baseUrl: 'http://localhost:8081',
  
  // 图片路径前缀
  imagePath: '/api/images',
};

// 完整图片URL构建函数
// 参考后端管理平台 ImageUpload.vue 的 fullImageUrl 计算属性
const getFullImageUrl = (relativePath: string | undefined | null): string => {
  // 处理空值
  if (!relativePath) {
    return '';
  }

  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 拼接完整URL
  return `${imageConfig.baseUrl}${relativePath}`;
};

// API基础配置
const apiConfig = {
  baseUrl: 'http://localhost:8081',
  apiPath: '/api',
};

// 导出配置
export {
  imageConfig,
  apiConfig,
  getFullImageUrl,
};

export default {
  imageConfig,
  apiConfig,
  getFullImageUrl,
};
