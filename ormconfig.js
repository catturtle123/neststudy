const dbConfig = {
    synchronize: false,
};

switch(process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            databse: 'db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            databse: 'db.sqlite',
            entities: ['**/*.entity.ts'],
        });
        break;
    case 'production':
        break;
    default:
        throw new Error('unkown environment');
}

module.exports = dbConfig;