/**
 * Safely extracts object relative path for Supabase storage deletion.
 */
export function extractStoragePath(
  urlOrPath: string | null | undefined,
  bucketName: string
): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;

  const trimmed = urlOrPath.trim();
  if (!trimmed) return null;

  const marker = `/${bucketName}/`;
  if (trimmed.includes(marker)) {
    try {
      const parts = trimmed.split(marker);
      const relative = parts[parts.length - 1].split('?')[0].split('#')[0];
      return relative ? decodeURIComponent(relative) : null;
    } catch {
      const parts = trimmed.split(marker);
      const relative = parts[parts.length - 1].split('?')[0].split('#')[0];
      return relative || trimmed;
    }
  }

  const clean = trimmed.split('?')[0].split('#')[0];
  return clean || null;
}

