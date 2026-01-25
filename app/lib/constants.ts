export const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export function createApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function createApiUrlWithParams(path: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}