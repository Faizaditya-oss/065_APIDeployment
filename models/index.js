'use strict';

const fs = require('fs');
const path = require('path');
const pg = require('pg');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  const connectionUrl = process.env[config.use_env_variable];

  if (!connectionUrl) {
    throw new Error(`Environment variable ${config.use_env_variable} is missing. Please set it in Vercel.`);
  }

  const url = new URL(connectionUrl);

  url.searchParams.delete('sslmode');

  sequelize = new Sequelize(url.toString(), {
    dialect: config.dialect,
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize (
    config.database, 
    config.username, 
    config.password,
    {
      ...config,
      dialectModule: pg
    }
  );
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;