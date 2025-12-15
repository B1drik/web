import jwt from 'jsonwebtoken';
import type UserInterface from '@/types/UserInterface';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '1h';

// Измените название типа, чтобы избежать конфликта
export interface AppJwtPayload {
  sub: number;
  email: string;
  fullName: string;
  isActive: boolean;
  iat?: number; // issued at
  exp?: number; // expiration time
}

export function signJwt(payload: AppJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token?: string): UserInterface | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Проверяем тип декодированного значения
    if (typeof decoded === 'string') {
      return null;
    }
    
    // Используйте правильное приведение типа
    const payload = decoded as unknown as AppJwtPayload;
    
    return {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      password: '', // Пароль не хранится в токене
      isActive: payload.isActive,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Вспомогательная функция для извлечения пользователя из запроса
export function getAuthUserFromCookies(cookies: string): UserInterface | null {
  try {
    const cookieArray = cookies.split(';');
    const tokenCookie = cookieArray.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );
    
    if (!tokenCookie) return null;
    
    const token = tokenCookie.split('=')[1];
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}