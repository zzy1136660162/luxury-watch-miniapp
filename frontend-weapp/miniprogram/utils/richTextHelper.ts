/**
 * 富文本处理工具
 * 用于处理小程序端rich-text组件的样式问题
 */

/**
 * 处理富文本内容，应用行高样式
 * @param htmlContent HTML内容
 * @param imageBaseUrl 图片基础URL（不含路径前缀），如 http://101.126.90.255:8081
 * @param defaultLineHeight 默认行高
 * @returns 处理后的HTML内容
 */
export function processRichText(htmlContent: string, imageBaseUrl: string = 'http://101.126.90.255:8081', defaultLineHeight: string = '2'): string {
  if (!htmlContent) return '';

  let content = htmlContent;

  // 提取行高值
  const lineHeightMatch = content.match(/line-height\s*:\s*(\d+(?:\.\d+)?(?:\s*!important)?)/i)
  const lineHeight = lineHeightMatch ? lineHeightMatch[1].replace(/!important/, '').trim() : defaultLineHeight

  // 处理图片URL，添加完整前缀
  // 匹配 /api/images/xxx 或 /images/xxx
  content = content.replace(/src=["'](\/api\/images\/[^"']+)["']/g, `src="${imageBaseUrl}$1"`)
  content = content.replace(/src=["'](\/images\/[^"']+)["']/g, `src="${imageBaseUrl}/api$1"`)
  
  // 匹配相对路径 images/xxx
  content = content.replace(/src=["'](images\/[^"']+)["']/g, `src="${imageBaseUrl}/api/$1"`)
  
  // 匹配不带任何前缀的图片文件名
  content = content.replace(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp))["']/gi, (match, p1) => {
    if (p1.startsWith('http://') || p1.startsWith('https://') || p1.startsWith('/')) {
      return match
    }
    return `src="${imageBaseUrl}/api/images/${p1}"`
  })

  // 为图片添加默认样式
  content = content.replace(/<img(?![^>]*style=)/gi, `<img style="max-width:100%;height:auto;"`)
  content = content.replace(/<img([^>]*)style=["']([^"']*)["']/gi, (match, attrs, style) => {
    if (!style.includes('max-width')) {
      return `<img${attrs}style="${style}max-width:100%;height:auto;"`
    }
    return match
  })

  // 清理并包裹外层div
  content = content.trim()
  
  if (content.startsWith('<div')) {
    content = content.replace(/^<div([^>]*)>/, `<div$1 style="line-height:${lineHeight};">`)
  } else {
    content = `<div style="line-height:${lineHeight};">${content}</div>`
  }

  return content;
}
