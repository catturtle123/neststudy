import { DataSource } from 'typeorm';
import { TYPEORM_CONFIG } from './config/typeorm.config';

const env = process.env.NODE_ENV || 'development';

export default new DataSource(TYPEORM_CONFIG[env]);