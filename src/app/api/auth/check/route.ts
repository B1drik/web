import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/utils/jwt';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ 
        isAuthenticated: false,
        user: null 
      });
    }

    // Извлекаем токен из куки
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies.accessToken;
    const user = verifyAccessToken(token);

    return NextResponse.json({
      isAuthenticated: !!user,
      user,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false,
      user: null 
    });
  }
}