const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(
  process.env.SQL_SERVER
);

module.exports = pool;