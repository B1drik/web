import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { Student } from './entity/Student.entity';
import { Group } from './entity/Group.entity';
import { User } from './entity/User.entity';

const timeout = 30000;

const usingPostgres = !!process.env.POSTGRES;
const isProd = process.env.NODE_ENV === 'production';

const config: DataSourceOptions = {
  ...(usingPostgres
    ? {
      type: 'postgres',
      url: process.env.POSTGRES,
      ssl: true,
      connectTimeoutMS: timeout,
      extra: {
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: timeout,
        query_timeout: timeout,
        idle_in_transaction_session_timeout: timeout,
      },
    }
    : {
      type: 'sqlite',
      database: process.env.DB ?? './db/vki-web.db',
    }),
  // Для Neon на Vercel включаем synchronize (миграций нет, иначе "relation does not exist")
  // Если позже появятся миграции — можно отключить синхронизацию и включить migrationsRun
  synchronize: usingPostgres ? true : !isProd,
  migrationsRun: usingPostgres ? false : isProd,
  logging: process.env.NODE_ENV === 'development',
  // Используем прямые ссылки на классы - это работает и в production
  entities: [Student, Group, User],
};

const AppDataSource = new DataSource(config);

export const dbInit = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      console.log('AppDataSource.isInitialized');
      return;
    }
    await AppDataSource.initialize();
    console.log('AppDataSource.initialize');
  }
  catch (error) {
    console.error('Database initialization error:', error);
    // Пробрасываем ошибку дальше, чтобы API route мог её обработать
    throw error;
  }
};

// await dbInit();

export default AppDataSource;