export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASS || 'postgres',
    name: process.env.DATABASE_NAME || 'mydb',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },

  logstash: {
    host: process.env.LOGSTASH_HOST || 'localhost',
    port: parseInt(process.env.LOGSTASH_PORT, 10) || 5044,
  }
});
