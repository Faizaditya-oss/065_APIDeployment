require('dotenv').config();

const development = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};

const production = {
  // Prefer `DATABASE_URL` (common on many hosts), fall back to `POSTGRES_URL`
  use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : (process.env.POSTGRES_URL ? 'POSTGRES_URL' : 'DATABASE_URL'),
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    },
  },
};

module.exports = {
  development,
  production,
};