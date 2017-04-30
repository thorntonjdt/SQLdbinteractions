var mysql = require('mysql');
var pool = mysql.createPool({

// Fill out with your own db info
  connectionLimit: 10,
  host: '',
  user: '',
  password: '',
  database: ''
});

module.exports.pool = pool;
