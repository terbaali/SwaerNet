const db = require('../db');



const createUser = (ip) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (user_name, email, role, password) VALUES (?, ?, ?, ?)';
      const values = [user.user_name, user.email, user.role, user.password];
  
      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve(result.insertId);
        }
      });
    });
  };


module.exports = { 
    checkBan,
    banIp, 
};