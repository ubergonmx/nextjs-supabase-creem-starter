/**
 * Resolves a raw URL error param to a human-readable message.
 * Falls back to decoding the param itself (for raw API error strings).
 */
export function resolveError(code: string | undefined, map: Record<string, string>): string | null {
  if (!code) return null;
  const mapped = map[code];
  if (mapped) return mapped;

  try {
    return decodeURIComponent(code);
  } catch {
    return code;
  }
}
