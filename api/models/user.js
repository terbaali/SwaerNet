const db = require('./db'); 

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (user_name, email, role, password) VALUES (?, ?, ?, ?)';
    const values = [user.user_name, user.email, user.role, user.password];

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

module.exports = { createUser };
const userSchema = {
  user_name: {
    type: 'VARCHAR(45)',
    required: true,
  },
  email: {
    type: 'VARCHAR(45)',
    required: true,
  },
  role: {
    type: 'VARCHAR(45)',
    required: true,
  },
  password: {
    type: 'VARCHAR(64)',
    required: true,
  },
};

module.exports = { 
    createUser,
    userSchema, 
};