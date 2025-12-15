/**
 * Хелпер для выполнения fetch запросов к API
 * Всегда использует относительные пути для работы на любом домене (localhost, Vercel, etc.)
 * 
 * @param endpoint - API endpoint без префикса /api (например: 'groups' или 'students/1')
 * @param options - Опции для fetch (method, headers, body и т.д.)
 * @returns Promise<Response>
 * 
 * @example
 * fetchAPI('groups') // => fetch('/api/groups')
 * fetchAPI('students/1', { method: 'DELETE' }) // => fetch('/api/students/1', { method: 'DELETE' })
 */
export const fetchAPI = async (
  endpoint: string,
  options?: RequestInit,
): Promise<Response> => {
  // Убираем ведущий слэш, если он есть
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  const isServer = typeof window === 'undefined';

  // В браузере — всегда относительный путь
  if (!isServer) {
    const base = '/api/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return fetch(`${normalizedBase}${cleanEndpoint}`, options);
  }

  // На сервере нужен абсолютный URL:
  // 1) явные переменные окружения имеют приоритет
  // 2) Vercel — публичный домен из VERCEL_URL
  // 3) локально — localhost:PORT (или 3000)
  const serverBase = (() => {
    const fromEnv = process.env.NEXT_PUBLIC_API || process.env.API_BASE_URL;
    if (fromEnv) return fromEnv;

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/`;
    }

    const port = process.env.PORT ?? '3000';
    return `http://localhost:${port}/api/`;
  })();

  const normalizedBase = serverBase.endsWith('/') ? serverBase : `${serverBase}/`;
  const url = new URL(cleanEndpoint, normalizedBase).toString();

  return fetch(url, options);
};

