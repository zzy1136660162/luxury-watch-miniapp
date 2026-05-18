/**
 * 富文本处理工具
 * 用于处理小程序端rich-text组件的样式问题
 */

/**
 * 处理富文本内容，应用行高样式
 * 方案：在内容外层包裹div标签设置行高，简化处理逻辑
 * @param htmlContent HTML内容
 * @param baseUrl 图片基础URL
 * @param defaultLineHeight 默认行高（当未找到编辑器设置的行高时使用）
 * @returns 处理后的HTML内容
 */
export function processRichText(htmlContent: string, baseUrl: string = 'http://localhost:8081', defaultLineHeight: string = '2'): string {
  if (!htmlContent) return '';

  let content = htmlContent;

  // 1. 提取HTML中的行高值（如果有的话）
  const lineHeightMatch = content.match(/line-height\s*:\s*(\d+(?:\.\d+)?(?:\s*!important)?)/i)
  const lineHeight = lineHeightMatch ? lineHeightMatch[1].replace(/!important/, '').trim() : defaultLineHeight

  // 2. 处理图片URL，添加完整前缀
  content = content.replace(/src=["'](\/api\/images\/[^"']+)["']/g, `src="${baseUrl}$1"`)
  content = content.replace(/src=["'](\/images\/[^"']+)["']/g, `src="${baseUrl}$1"`)
  content = content.replace(/src=["'](images\/[^"']+)["']/g, `src="${baseUrl}/api/$1"`)
  content = content.replace(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp))["']/gi, (match, p1) => {
    if (p1.startsWith('http://') || p1.startsWith('https://')) {
      return match
    }
    return `src="${baseUrl}/api/images/${p1}"`
  })

  // 3. 为图片添加默认样式
  content = content.replace(/<img(?![^>]*style=)/gi, `<img style="max-width:100%;height:auto;"`)
  content = content.replace(/<img([^>]*)style=["']([^"']*)["']/gi, (match, attrs, style) => {
    if (!style.includes('max-width')) {
      return `<img${attrs}style="${style}max-width:100%;height:auto;"`
    }
    return match
  })

  // 4. 包裹外层div设置行高
  // 清理内容中的多余换行和空格
  content = content.trim()
  
  // 如果内容已经有外层div，直接在其上设置行高
  if (content.startsWith('<div')) {
    content = content.replace(/^<div([^>]*)>/, `<div$1 style="line-height:${lineHeight};">`)
  } else {
    // 否则包裹一层div
    content = `<div style="line-height:${lineHeight};">${content}</div>`
  }

  return content
}

/**
 * 提取HTML中的行高值
 * @param htmlContent HTML内容
 * @returns 行高值，如果未找到则返回默认值2
 */
export function extractLineHeight(htmlContent: string): string {
  if (!htmlContent) return '2'
  
  const match = htmlContent.match(/line-height\s*:\s*(\d+(?:\.\d+)?(?:\s*!important)?)/i)
  return match ? match[1].replace(/!important/, '').trim() : '2'
}
