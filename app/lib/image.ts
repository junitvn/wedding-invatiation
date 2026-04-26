const R2_BASE = 'https://pub-f552cac994c34eee8fcc5d0286678dba.r2.dev';

export function imageUrl(path: string): string {
  return `${R2_BASE}/${path.replace(/^\//, '')}`;
}
