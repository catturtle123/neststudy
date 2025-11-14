import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

const COMMON: Partial<DataSourceOptions> = {
  synchronize: false,
  migrations: [join(__dirname, '../../migrations/*{.ts,.js}')],
  entities: [join(__dirname, '../../**/*.entity.{ts,js}')],
};

export const TYPEORM_CONFIG: Record<string, DataSourceOptions> = {
  development: {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  },
  test: {
    type: 'sqlite',
    database: 'test.sqlite',
    synchronize: false,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
  },
  production: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  },
};
