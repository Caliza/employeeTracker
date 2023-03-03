const mysql = require('mysql2')

const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

  module.exports = db;