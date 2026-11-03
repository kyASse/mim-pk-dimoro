/**
 * Lightweight, zero-dependency server/client HTML sanitizer
 * Removes dangerous tags, event handlers, and javascript: protocols.
 */
const FORBIDDEN_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'base',
  'form',
  'input',
  'button',
  'svg',
  'math',
];

export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  let clean = dirty;

  // 1. Remove forbidden tags and their inner content (looping to catch nested attempts)
  for (const tag of FORBIDDEN_TAGS) {
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosing = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
    let prev: string;
    do {
      prev = clean;
      clean = clean.replace(regex, '').replace(selfClosing, '');
    } while (clean !== prev);
  }

  // 2. Remove all inline event handlers (on\w+="...")
  clean = clean.replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Remove javascript: in attributes (quoted and unquoted)
  clean = clean.replace(/href\s*=\s*(")[^"]*javascript:[^"]*\1/gi, 'href="#"');
  clean = clean.replace(/href\s*=\s*(')[^']*javascript:[^']*\1/gi, 'href="#"');
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"');

  clean = clean.replace(/src\s*=\s*(")[^"]*javascript:[^"]*\1/gi, 'src=""');
  clean = clean.replace(/src\s*=\s*(')[^']*javascript:[^']*\1/gi, 'src=""');
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""');

  return clean;
}
