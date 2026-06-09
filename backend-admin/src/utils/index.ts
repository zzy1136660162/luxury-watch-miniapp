import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import path from 'path-browserify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveRoutePath(basePath?: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}

// 格式化日期时间，将 T 替换为空格
export function formatDateTime(dateTime: string | undefined | null): string {
  if (!dateTime) return '-'
  return dateTime.replace('T', ' ')
}
