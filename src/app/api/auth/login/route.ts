import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/utils/jwt';
import AppDataSource from '@/db/AppDataSource';
import { User } from '@/db/entity/User.entity';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Инициализируем соединение с базой
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Укажите email и пароль' },
        { status: 400 },
      );
    }

    // Ищем пользователя
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 401 },
      );
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Неверный пароль' },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Пользователь деактивирован' },
        { status: 401 },
      );
    }

    // Создаем JWT токен
    const token = signJwt({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    });

    const response = NextResponse.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    });

    // Устанавливаем httpOnly куку
    response.cookies.set({
      name: 'accessToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 час
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера при авторизации' },
      { status: 500 },
    );
  }
}