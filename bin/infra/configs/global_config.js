require('dotenv').config()
const confidence = require('confidence');
const config = {
  port: process.env.PORT,
  dbhost: process.env.DB_HOST || '127.0.0.1',
  dbuser: process.env.DB_USER || 'root',
  dbpassword: process.env.DB_PASSWORD || '',
  database: process.env.DATABASE,
  token: process.env.TOKEN_SECRET || 'secret'
};

const store = new confidence.Store(config);
exports.get = key => store.get(key);

