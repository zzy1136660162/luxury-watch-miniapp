/**
 * 小程序统一 API 配置文件
 * 
 * 修改服务器地址只需修改下方 SERVER_BASE_URL 即可
 * 其他所有模块会自动引用此配置
 */

const SERVER_BASE_URL = 'http://167.88.180.246:8081';
const API_PREFIX = '/api';

const apiConfig = {
  // 服务器基础地址（包含端口）
  baseUrl: SERVER_BASE_URL,
  
  // API 前缀
  apiPrefix: API_PREFIX,
  
  // 完整的 API 地址
  apiBaseUrl: SERVER_BASE_URL + API_PREFIX,
  
  // 图片访问地址（API 地址 + /images）
  imageUrl: SERVER_BASE_URL + '/api/images',
};

export default apiConfig;
export { SERVER_BASE_URL, API_PREFIX, apiConfig };
