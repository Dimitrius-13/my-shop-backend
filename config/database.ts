// config/database.js

const parse = require("pg-connection-string").parse;

module.exports = ({ env }) => {
  // Якщо Strapi знайде змінну DATABASE_URL (це наш Render Postgres), він використає її.
  if (env("DATABASE_URL")) {
    const config = parse(env("DATABASE_URL"));
    return {
      connection: {
        client: "postgres",
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          // Обов'язково для Render:
          ssl: {
            rejectUnauthorized: false,
          },
        },
        acquireConnectionTimeout: 60000,
      },
    };
  }

  // Якщо DATABASE_URL не знайдено (наприклад, для локальної розробки),
  // Strapi повернеться до SQLite, щоб не ламати локальне середовище.
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: ".tmp/data.db",
      },
      useNullAsDefault: true,
    },
  };
};
