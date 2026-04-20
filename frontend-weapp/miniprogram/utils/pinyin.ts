import pinyin from 'wl-pinyin'

export function getPinyinFirstLetter(chinese: string): string {
  if (!chinese || chinese.length === 0) return '#';

  const firstChar = chinese.charAt(0);
  if (/[a-zA-Z]/.test(firstChar)) return firstChar.toUpperCase();
  if (/[0-9]/.test(firstChar)) return '#';

  try {
    const result = pinyin.getFirstLetter(firstChar);
    if (result) {
      return result.toUpperCase();
    }
  } catch (e) {
    console.error('拼音转换失败:', e);
  }

  return '#';
}

export function sortByPinyin(items: string[]): { letter: string; items: string[] }[] {
  const groups: { [key: string]: string[] } = {};

  items.forEach(item => {
    const letter = getPinyinFirstLetter(item);
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });

  return Object.keys(groups).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  }).map(key => ({
    letter: key,
    items: groups[key].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }));
}
