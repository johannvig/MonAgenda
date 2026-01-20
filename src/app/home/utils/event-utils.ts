export function getEventKey(title: string, start: any, end: any): string {
  const s = start ? new Date(start).getTime() : 0;
  const e = end ? new Date(end).getTime() : 0;
  return `${title}__${s}__${e}`;
}

export function getBaseCourseName(title: string): string {
  if (!title) return '';
  return title.replace(/\s*\(.*\)/, '').trim();
}
