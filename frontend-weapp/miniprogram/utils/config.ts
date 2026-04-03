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

// 处理单张图片URL
const getFullImageUrl = (relativePath: string | undefined | null): string => {
  // 处理空值
  if (!relativePath) {
    return '';
  }

  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 如果包含逗号，取第一张
  if (relativePath.includes(',')) {
    relativePath = relativePath.split(',')[0];
  }

  // 去除可能存在的 /api 前缀
  if (relativePath.startsWith('/api/')) {
    relativePath = relativePath.substring(4);
  }

  // 拼接完整URL
  return `${imageConfig.baseUrl}${relativePath}`;
};

// 将逗号分隔的图片字符串转换为数组
const getImageList = (imageStr: string | undefined | null): string[] => {
  if (!imageStr) return [];
  
  return imageStr.split(',').filter(Boolean).map(img => img.trim());
};

// 将逗号分隔的图片字符串转换为完整URL数组
const getImageUrls = (imageStr: string | undefined | null): string[] => {
  return getImageList(imageStr).map(img => getFullImageUrl(img));
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
  getImageList,
  getImageUrls,
};

export default {
  imageConfig,
  apiConfig,
  getFullImageUrl,
  getImageList,
  getImageUrls,
};
