const mysql = require('mysql2');
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error in database connection: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database, threadId: ' + connection.threadId);
});

module.exports = connection;