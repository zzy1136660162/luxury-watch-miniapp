/**
 * 小程序配置文件
 * 包含图片前缀等配置信息
 * 参考后端管理平台的图片处理方式
 */

import { apiConfig } from './api-config';

/**
 * 处理单张图片URL
 * 兼容两种路径格式：
 * - /api/images/xxx.png (完整路径)
 * - /images/xxx.png (缺少api前缀)
 */
const getFullImageUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) {
    return '';
  }

  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  if (relativePath.includes(',')) {
    relativePath = relativePath.split(',')[0];
  }

  // 兼容处理：以 /images/ 开头但不是以 /api/images/ 开头的路径
  if (relativePath.startsWith('/images/') && !relativePath.startsWith('/api/images/')) {
    return `${apiConfig.baseUrl}/api${relativePath}`;
  }

  // 如果是完整路径 /api/images/xxx，直接拼接 baseUrl
  if (relativePath.startsWith('/api/images/')) {
    return `${apiConfig.baseUrl}${relativePath}`;
  }

  // 其他情况，拼接 imageUrl
  return `${apiConfig.imageUrl}/${relativePath}`;
};

/**
 * 处理单张视频URL
 * 后端返回路径如：/images/videos/2026-05/xxx.mp4
 * 需要拼接为：http://xxx:8081/images/videos/2026-05/xxx.mp4
 */
const getFullVideoUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) {
    return '';
  }

  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 移除开头的 /
  let cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  // 视频路径直接使用 baseUrl + 路径
  return `${apiConfig.baseUrl}/${cleanPath}`;
};

/**
 * 将逗号分隔的图片字符串转换为数组
 */
const getImageList = (imageStr: string | undefined | null): string[] => {
  if (!imageStr) return [];
  
  return imageStr.split(',').filter(Boolean).map(img => img.trim());
};

/**
 * 将逗号分隔的图片字符串转换为完整URL数组
 */
const getImageUrls = (imageStr: string | undefined | null): string[] => {
  return getImageList(imageStr).map(img => getFullImageUrl(img));
};

export {
  getFullImageUrl,
  getFullVideoUrl,
  getImageList,
  getImageUrls,
};

export default {
  getFullImageUrl,
  getFullVideoUrl,
  getImageList,
  getImageUrls,
};
