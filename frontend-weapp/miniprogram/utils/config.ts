/**
 * 小程序配置文件
 * 包含图片前缀等配置信息
 * 参考后端管理平台的图片处理方式
 */

import { apiConfig } from './api-config';

/**
 * 处理单张图片URL
 * 后端返回路径格式如：/images/2026-05/xxx.jpg
 * 拼接为完整URL
 */
const getFullImageUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) {
    return '';
  }

  // 如果是本地文件路径（微信小程序的本地文件），直接返回空字符串
  if (relativePath.startsWith('wxfile://') || 
      relativePath.startsWith('http://tmp') ||
      relativePath.startsWith('wxfile://tmp')) {
    return '';
  }

  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 处理富文本HTML标签中的图片（截取src属性）
  if (relativePath.includes('<img')) {
    const srcMatch = relativePath.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      relativePath = srcMatch[1];
    }
  }

  // 处理逗号分隔的多图片（取第一张）
  if (relativePath.includes(',')) {
    relativePath = relativePath.split(',')[0];
  }

  // 移除开头的斜杠
  let cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;

  // 直接拼接 baseUrl（后端已配置 /images/** 映射）
  return `${apiConfig.baseUrl}/${cleanPath}`;
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
